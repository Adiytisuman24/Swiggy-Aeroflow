package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sync"

	"aeroflow/core/intelligence"
	"aeroflow/core/mcp"
)

type CartItem struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	Restaurant string  `json:"restaurant"`
	Price      float64 `json:"price"`
	Quantity   int     `json:"quantity"`
	Tag        string  `json:"tag"`
	Nutrition  string  `json:"nutrition"`
}

type Server struct {
	mcpCl   *mcp.SwiggyMCPClient
	intelCl *intelligence.IntelligenceClient
	cartMu  sync.Mutex
	cart    []CartItem
}

func main() {
	mcpURL := os.Getenv("MCP_URL")
	if mcpURL == "" {
		mcpURL = "http://mcp.swiggy.local"
	}
	
	intelAddr := os.Getenv("AI_SERVICE_URL")
	if intelAddr == "" {
		intelAddr = "localhost:8000"
	}

	s := &Server{
		mcpCl:   mcp.NewClient(mcpURL),
		intelCl: intelligence.NewClient(intelAddr),
		cart: []CartItem{
			{ID: "1", Name: "Chicken Biryani", Restaurant: "Behrouz Biryani", Price: 349, Quantity: 1, Tag: "predicted", Nutrition: "Protein: 38g | Carbs: 72g"},
			{ID: "2", Name: "Multigrain Roti (4pc)", Restaurant: "HomeMade Kitchen", Price: 80, Quantity: 1, Tag: "auto-replenish", Nutrition: "Fiber: 6g | Carbs: 48g"},
			{ID: "3", Name: "Cold Brew Coffee", Restaurant: "Blue Tokai", Price: 189, Quantity: 1, Tag: "predicted", Nutrition: "Caffeine: 150mg | Cal: 20"},
			{ID: "4", Name: "Milk 1L", Restaurant: "Swiggy Instamart", Price: 65, Quantity: 2, Tag: "auto-replenish", Nutrition: "Protein: 8g | Calcium: 300mg"},
		},
	}

	http.HandleFunc("/api/orchestrate", s.handleOrchestrate)
	http.HandleFunc("/api/cbo", s.handleCBO)
	http.HandleFunc("/api/cart", s.handleCart)
	http.HandleFunc("/api/cart/add", s.handleCartAdd)
	http.HandleFunc("/api/cart/remove", s.handleCartRemove)
	http.HandleFunc("/api/cart/clear", s.handleCartClear)
	http.HandleFunc("/api/cart/update", s.handleCartUpdate)
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "OK")
	})
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		fmt.Fprintf(w, "Aeroflow Core Service Active")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Aeroflow Core starting on :%s...\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		fmt.Printf("Error starting server: %v\n", err)
	}
}

func (s *Server) handleOrchestrate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	query := r.URL.Query()
	userID := query.Get("user_id")
	if userID == "" {
		userID = "default_user"
	}

	weather := query.Get("weather")
	if weather == "" {
		weather = "clear"
	}

	timeOfDay := query.Get("time_of_day")
	if timeOfDay == "" {
		timeOfDay = "evening"
	}

	recentActivity := query.Get("recent_activity")
	if recentActivity == "" {
		recentActivity = "sedentary"
	}

	var budgetRemaining float64 = 500.0
	if bStr := query.Get("budget_remaining"); bStr != "" {
		fmt.Sscanf(bStr, "%f", &budgetRemaining)
	}

	scheduleLoad := query.Get("schedule_load")
	if scheduleLoad == "" {
		scheduleLoad = "medium"
	}

	var groupSize int = 1
	if gStr := query.Get("group_size"); gStr != "" {
		fmt.Sscanf(gStr, "%d", &groupSize)
	}

	userCtx := intelligence.UserContext{
		UserID:          userID,
		Weather:         weather,
		TimeOfDay:       timeOfDay,
		RecentActivity:  recentActivity,
		BudgetRemaining: budgetRemaining,
		ScheduleLoad:    scheduleLoad,
		GroupSize:       groupSize,
	}

	// Get AI recommendation
	recommendation, err := s.intelCl.GetRecommendation(userCtx)
	if err != nil {
		http.Error(w, fmt.Sprintf("Intelligence layer error: %v", err), http.StatusInternalServerError)
		return
	}

	// Extract top recommendation and add it to cart automatically!
	if topRec, ok := recommendation["top_recommendation"].(string); ok && topRec != "" && topRec != "No recommendation" {
		s.cartMu.Lock()
		restaurant := "Swiggy Food"
		price := 199.0
		nutrition := "Calculated by AI Agent"
		tag := "predicted"

		// Customize details based on recommendation name
		if topRec == "Warm Protein Chicken Ramen & Soft Boiled Eggs" {
			restaurant = "Ramen Noodle Bar"
			price = 299.0
			nutrition = "Protein: 42g | Carbs: 55g"
		} else if topRec == "Chilled Double-Protein Shake & Grilled Avocado Salad" {
			restaurant = "Instamart Gym Store"
			price = 220.0
			nutrition = "Protein: 35g | Fats: 18g"
		} else if topRec == "Comfort food (Hot Chicken Biryani, Dal Makhani with Garlic Naan)" {
			restaurant = "Behrouz Biryani"
			price = 349.0
			nutrition = "Protein: 28g | Carbs: 85g"
		} else if topRec == "Soothing Warm Quinoa Khichdi & Steamed Veggies" {
			restaurant = "HomeMade Kitchen"
			price = 149.0
			nutrition = "Fiber: 12g | Carbs: 35g"
		} else if topRec == "Balanced Superfood Salad Bowl & Whole Wheat Tortilla Wrap" {
			restaurant = "Fresh Prep Salad Co"
			price = 199.0
			nutrition = "Fiber: 8g | Protein: 12g"
		}

		found := false
		for i, cItem := range s.cart {
			if cItem.Name == topRec {
				s.cart[i].Quantity += 1
				found = true
				break
			}
		}
		if !found {
			s.cart = append(s.cart, CartItem{
				ID:         fmt.Sprintf("ai_%d", len(s.cart)+1),
				Name:       topRec,
				Restaurant: restaurant,
				Price:      price,
				Quantity:   1,
				Tag:        tag,
				Nutrition:  nutrition,
			})
		}
		s.cartMu.Unlock()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(recommendation)
}

func (s *Server) handleCBO(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var reqBody map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	res, err := s.intelCl.GetCBO(reqBody)
	if err != nil {
		http.Error(w, fmt.Sprintf("Intelligence service error: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func (s *Server) handleCart(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	s.cartMu.Lock()
	defer s.cartMu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s.cart)
}

func (s *Server) handleCartAdd(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	var item CartItem
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	s.cartMu.Lock()
	defer s.cartMu.Unlock()

	found := false
	for i, cItem := range s.cart {
		if cItem.Name == item.Name {
			s.cart[i].Quantity += item.Quantity
			found = true
			break
		}
	}

	if !found {
		if item.ID == "" {
			item.ID = fmt.Sprintf("%d", len(s.cart)+1)
		}
		s.cart = append(s.cart, item)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s.cart)
}

func (s *Server) handleCartRemove(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	var req struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	s.cartMu.Lock()
	defer s.cartMu.Unlock()

	var newCart []CartItem
	for _, item := range s.cart {
		if item.ID != req.ID {
			newCart = append(newCart, item)
		}
	}
	s.cart = newCart

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s.cart)
}

func (s *Server) handleCartClear(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	s.cartMu.Lock()
	defer s.cartMu.Unlock()

	s.cart = []CartItem{}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s.cart)
}

func (s *Server) handleCartUpdate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	var req struct {
		ID       string `json:"id"`
		Quantity int    `json:"quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	s.cartMu.Lock()
	defer s.cartMu.Unlock()

	var newCart []CartItem
	for _, item := range s.cart {
		if item.ID == req.ID {
			if req.Quantity > 0 {
				item.Quantity = req.Quantity
				newCart = append(newCart, item)
			}
		} else {
			newCart = append(newCart, item)
		}
	}
	s.cart = newCart

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(s.cart)
}
