variable "project" {
  type = string
}

variable "stage" {
  type = string
}

variable "region" {
  type        = string
  default     = "eu-west-3"
}

variable "frontend_allowed_origins" {
  type    = list(string)
  default = ["http://localhost:3000", "https://main.d15muhyy3o82qt.amplifyapp.com"]
}

variable "openai_api_key" {
  type        = string
  description = "OpenAI API Key for AI processing"
  sensitive   = true
}

variable "supabase_url" {
  type        = string
  description = "Supabase project URL"
  sensitive   = false
}

variable "supabase_service_key" {
  type        = string
  description = "Supabase service role key (for Lambda, not public key)"
  sensitive   = true
}

variable "scrapecreators_api_key" {
  type        = string
  description = "ScrapeCreators API Key"
  sensitive   = true
  default     = ""
}

variable "coinglass_api_key" {
  type        = string
  description = "CoinGlass API Key"
  sensitive   = true
  default     = ""
}

variable "unusual_whales_api_key" {
  type        = string
  description = "Unusual Whales API Key for ticker activity service"
  sensitive   = true
  default     = ""
}

variable "fmp_api_key" {
  type        = string
  description = "Financial Modeling Prep API Key for ticker quotes"
  sensitive   = true
  default     = ""
}

variable "neo4j_uri" {
  type        = string
  description = "Neo4j AURA URI"
  sensitive   = true
  default     = ""
}

variable "neo4j_username" {
  type        = string
  description = "Neo4j username"
  sensitive   = true
  default     = "neo4j"
}

variable "neo4j_password" {
  type        = string
  description = "Neo4j password"
  sensitive   = true
  default     = ""
}

variable "neo4j_database" {
  type        = string
  description = "Neo4j database name"
  sensitive   = false
  default     = "neo4j"
}
