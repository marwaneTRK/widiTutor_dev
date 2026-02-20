from config import get_settings

settings = get_settings()


def validate_messages(messages: list) -> tuple[bool, str]:
    """Validate chat messages"""
    if not isinstance(messages, list):
        return False, "Messages must be a list"

    if len(messages) == 0:
        return False, "Messages cannot be empty"

    if len(messages) > settings.max_messages:
        return False, f"Too many messages (max {settings.max_messages})"

    total_length = 0
    for msg in messages:
        if not isinstance(msg, dict):
            return False, "Each message must be an object"

        if "role" not in msg or "content" not in msg:
            return False, "Messages must have 'role' and 'content'"

        if msg["role"] not in ["user", "assistant", "system"]:
            return False, "Invalid message role"

        if not isinstance(msg["content"], str):
            return False, "Message content must be a string"

        if len(msg["content"]) > settings.max_message_length:
            return False, f"Message too long (max {settings.max_message_length} chars)"

        total_length += len(msg["content"])

    if total_length > settings.max_total_length:
        return False, f"Total message length too long (max {settings.max_total_length} chars)"

    return True, ""
