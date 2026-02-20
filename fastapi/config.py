from pydantic_settings import BaseSettings
from pydantic import field_validator, computed_field
from functools import lru_cache
from typing import Optional, List

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # ========================================================================
    # API Keys (REQUIRED)
    # ========================================================================
    youtube_api_key: str
    groq_api_key: str
    internal_api_secret: str  # NEW: For Express HMAC authentication
    
    @field_validator('youtube_api_key', 'groq_api_key', 'internal_api_secret')
    @classmethod
    def validate_api_keys(cls, v: str, info) -> str:
        """Ensure API keys are not empty"""
        if not v or v.strip() == "":
            raise ValueError(f"{info.field_name} cannot be empty")
        
        # Special validation for internal_api_secret
        if info.field_name == 'internal_api_secret' and len(v.strip()) < 32:
            raise ValueError("internal_api_secret must be at least 32 characters")
        
        return v.strip()
    
    # ========================================================================
    # Server Configuration
    # ========================================================================
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    node_env: str = "development"  # development | production
    debug: bool = False
    
    @field_validator('node_env')
    @classmethod
    def validate_node_env(cls, v: str) -> str:
        """Ensure node_env is valid"""
        valid_envs = ["development", "production", "staging"]
        if v.lower() not in valid_envs:
            raise ValueError(f"node_env must be one of {valid_envs}")
        return v.lower()
    
    @computed_field
    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.node_env == "production"
    
    # ========================================================================
    # CORS Settings
    # ========================================================================
    cors_origins: str = "http://localhost:8501"
    cors_credentials: bool = True
    cors_methods: str = "GET,POST"
    cors_headers: str = "Content-Type,X-Internal-Auth"
    
    @computed_field
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS origins to list"""
        if self.cors_origins.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]
    
    @computed_field
    @property
    def cors_methods_list(self) -> List[str]:
        """Convert comma-separated CORS methods to list"""
        if self.cors_methods.strip() == "*":
            return ["*"]
        return [method.strip().upper() for method in self.cors_methods.split(",") if method.strip()]
    
    @computed_field
    @property
    def cors_headers_list(self) -> List[str]:
        """Convert comma-separated CORS headers to list"""
        if self.cors_headers.strip() == "*":
            return ["*"]
        return [header.strip() for header in self.cors_headers.split(",") if header.strip()]
    
    @field_validator('cors_origins')
    @classmethod
    def validate_cors_origins(cls, v: str) -> str:
        """Ensure CORS_ORIGINS is properly formatted"""
        if not v or v.strip() == "":
            return "http://localhost:8501"
        return v.strip()
    
    # ========================================================================
    # AI Model Settings (Groq)
    # ========================================================================
    groq_model: str = "llama-3.1-8b-instant"
    groq_temperature: float = 0.7
    groq_max_tokens_summary: int = 1000
    groq_max_tokens_quiz: int = 1500
    groq_max_tokens_chat: int = 1024
    
    @field_validator('groq_temperature')
    @classmethod
    def validate_temperature(cls, v: float) -> float:
        """Ensure temperature is within valid range"""
        if not 0 <= v <= 2:
            raise ValueError("Temperature must be between 0 and 2")
        return v
    
    # ========================================================================
    # YouTube Settings
    # ========================================================================
    youtube_max_results: int = 50
    transcript_max_length: int = 15000
    
    @field_validator('youtube_max_results')
    @classmethod
    def validate_max_results(cls, v: int) -> int:
        """Ensure max_results is within YouTube API limits"""
        if not 1 <= v <= 50:
            raise ValueError("Max results must be between 1 and 50")
        return v
    
    # ========================================================================
    # Security & Rate Limiting
    # ========================================================================
    rate_limit_per_minute: int = 30
    rate_limit_public: int = 20
    max_messages: int = 50
    max_message_length: int = 10000
    max_total_length: int = 50000
    hmac_timestamp_window: int = 300  # 5 minutes
    
    # ========================================================================
    # Application Settings
    # ========================================================================
    app_name: str = "Secure AI Backend with YouTube Features"
    app_version: str = "3.0.0"
    
    # ========================================================================
    # Database & Cache (Optional - for future use)
    # ========================================================================
    database_url: Optional[str] = None
    redis_url: Optional[str] = None
    cache_ttl: int = 3600
    
    # ========================================================================
    # Logging
    # ========================================================================
    log_level: str = "INFO"
    
    @field_validator('log_level')
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        """Ensure log level is valid"""
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        v_upper = v.upper()
        if v_upper not in valid_levels:
            raise ValueError(f"Log level must be one of {valid_levels}")
        return v_upper
    
    @computed_field
    @property
    def log_level_lower(self) -> str:
        """Get lowercase log level for uvicorn"""
        return self.log_level.lower()
    
    # ========================================================================
    # Frontend URL (used by CORS and frontend_url if needed separately)
    # ========================================================================
    frontend_url: Optional[str] = None
    
    @computed_field
    @property
    def frontend_url_list(self) -> List[str]:
        """Get frontend URLs (uses cors_origins if frontend_url not set)"""
        if self.frontend_url:
            return [url.strip() for url in self.frontend_url.split(",") if url.strip()]
        return self.cors_origins_list
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        env_file_encoding = "utf-8"
        extra = "ignore"  # Allow extra fields for forward compatibility


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance
    
    Uses lru_cache to ensure settings are loaded only once
    and reused throughout the application lifecycle
    """
    return Settings()


def print_settings():
    """Print current settings (excluding sensitive data)"""
    settings = get_settings()
    print("=" * 60)
    print(f"  {settings.app_name}")
    print("=" * 60)
    print(f"Version:           {settings.app_version}")
    print(f"Environment:       {settings.node_env}")
    print(f"Host:              {settings.api_host}:{settings.api_port}")
    print(f"Debug Mode:        {settings.debug}")
    print("-" * 60)
    print("API Configuration:")
    print(f"  YouTube API:     {'Configured' if settings.youtube_api_key else 'Missing'}")
    print(f"  Groq API:        {'Configured' if settings.groq_api_key else 'Missing'}")
    print(f"  Internal Secret: {'Configured' if settings.internal_api_secret else 'Missing'}")
    print("-" * 60)
    print("CORS Settings:")
    print(f"  Origins:         {settings.cors_origins_list}")
    print(f"  Methods:         {settings.cors_methods_list}")
    print(f"  Credentials:     {settings.cors_credentials}")
    print("-" * 60)
    print("AI Settings:")
    print(f"  Model:           {settings.groq_model}")
    print(f"  Temperature:     {settings.groq_temperature}")
    print(f"  Max Tokens:      Summary={settings.groq_max_tokens_summary}, "
          f"Quiz={settings.groq_max_tokens_quiz}, Chat={settings.groq_max_tokens_chat}")
    print("-" * 60)
    print("Limits:")
    print(f"  YouTube Results: {settings.youtube_max_results}")
    print(f"  Transcript Max:  {settings.transcript_max_length}")
    print(f"  Rate Limit:      {settings.rate_limit_per_minute}/min")
    print(f"  Log Level:       {settings.log_level}")
    print("=" * 60)


if __name__ == "__main__":
    # Test configuration loading
    try:
        print_settings()
    except Exception as e:
        print(f" Configuration Error: {e}")
        print("\nMake sure you have a .env file with all required variables:")
        print("  - YOUTUBE_API_KEY")
        print("  - GROQ_API_KEY")
        print("  - INTERNAL_API_SECRET")