package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"aeroflow/core/intelligence"
	"aeroflow/core/mcp"
)

type Server struct {
	mcpCl   *mcp.SwiggyMCPClient
	intelCl *intelligence.IntelligenceClient
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
	}

	http.HandleFunc("/api/orchestrate", s.handleOrchestrate)
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "OK")
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
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		userID = "default_user"
	}

	// 1. Get context from Swiggy MCP
	ctx, _ := s.mcpCl.GetUserContext(userID)

	// 2. Get AI recommendation
	recommendation, err := s.intelCl.GetRecommendation(userID, ctx)
	if err != nil {
		http.Error(w, "Intelligence layer error", http.StatusInternalServerError)
		return
	}

	// 3. Return to frontend
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user_id":        userID,
		"context":        ctx,
		"recommendation": recommendation,
		"status":         "PREDICTED",
	})
}
