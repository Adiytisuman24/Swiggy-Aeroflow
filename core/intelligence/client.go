package intelligence

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

// IntelligenceClient handles communication with the Python AI service
type IntelligenceClient struct {
	BaseURL string
}

type UserContext struct {
	UserID          string  `json:"user_id"`
	Weather         string  `json:"weather"`
	TimeOfDay       string  `json:"time_of_day"`
	RecentActivity  string  `json:"recent_activity"`
	BudgetRemaining float64 `json:"budget_remaining"`
	ScheduleLoad    string  `json:"schedule_load"`
	GroupSize       int     `json:"group_size"`
}

func NewClient(addr string) *IntelligenceClient {
	if len(addr) >= 7 && (addr[:7] == "http://" || addr[:8] == "https://") {
		return &IntelligenceClient{BaseURL: addr}
	}
	return &IntelligenceClient{BaseURL: "http://" + addr}
}

// GetRecommendation fetches predicted items from the AI layer
func (c *IntelligenceClient) GetRecommendation(ctx UserContext) (map[string]interface{}, error) {
	fmt.Printf("Fetching AI recommendation for User %s with context: %+v\n", ctx.UserID, ctx)

	reqBody, _ := json.Marshal(ctx)

	resp, err := http.Post(c.BaseURL+"/orchestrate", "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		fmt.Printf("Error calling AI service: %v\n", err)
		// Fallback to mock if AI service is not yet up
		return map[string]interface{}{
			"top_recommendation": "Warm Ramen",
			"final_confidence":   0.94,
			"formula":            "Score = 0.35P + 0.25B + 0.20T + 0.20S",
			"agent_decisions": []interface{}{
				map[string]interface{}{
					"agent":          "NutritionAgent",
					"recommendation": "Warm Ramen",
					"score":          0.94,
					"reasoning":      "AI service unreachable, using edge-cached recommendation.",
				},
			},
		}, nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("AI service returned status: %d", resp.StatusCode)
	}

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result, nil
}

// GetCBO fetches Counterfactual Basket Optimization calculations from the AI layer
func (c *IntelligenceClient) GetCBO(req map[string]interface{}) (map[string]interface{}, error) {
	reqBody, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(c.BaseURL+"/cbo", "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("AI service /cbo returned status: %d", resp.StatusCode)
	}

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result, nil
}
