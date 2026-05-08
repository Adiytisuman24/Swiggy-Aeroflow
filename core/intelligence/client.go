package intelligence

import (
	"fmt"
)

// IntelligenceClient handles communication with the Python AI service
type IntelligenceClient struct {
	// grpcClient proto.IntelligenceServiceClient
}

type Recommendation struct {
	Items           []string
	ConfidenceScore float32
	Reasoning       string
}

func NewClient(addr string) *IntelligenceClient {
	// Conn logic here
	return &IntelligenceClient{}
}

// GetRecommendation fetches predicted items from the AI layer
func (c *IntelligenceClient) GetRecommendation(userID string, contextStr string) (*Recommendation, error) {
	fmt.Printf("Fetching AI recommendation for User %s with context: %s\n", userID, contextStr)
	
	// Mocking gRPC response for now
	return &Recommendation{
		Items:           []string{"Warm Ramen", "Hot Chocolate", "Raincoat (Instamart)"},
		ConfidenceScore: 0.94,
		Reasoning:       "High workload + rainy weather detected. Recommending comfort food and essentials.",
	}, nil
}
