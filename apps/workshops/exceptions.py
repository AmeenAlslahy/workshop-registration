class WorkshopRegistrationError(Exception):
    """Base exception for all workshop registration business rules."""
    pass

class WorkshopFullError(WorkshopRegistrationError):
    """Raised when a workshop has no available seats."""
    pass

class AlreadyRegisteredError(WorkshopRegistrationError):
    """Raised when a participant already has an active registration."""
    pass

class AlreadyCancelledError(WorkshopRegistrationError):
    """Raised when trying to cancel a registration that is already cancelled."""
    pass

class DataInconsistencyError(WorkshopRegistrationError):
    """Raised when database invariants are violated (e.g., seats_taken is out of sync)."""
    pass