class WorkshopRegistrationError(Exception):
    """Base exception for all workshop registration business rules."""


class WorkshopFullError(WorkshopRegistrationError):
    """Raised when a workshop has no available seats."""

    code = 'error.workshop_full'


class AlreadyRegisteredError(WorkshopRegistrationError):
    """Raised when a participant already has an active registration."""

    code = 'error.already_registered'


class AlreadyCancelledError(WorkshopRegistrationError):
    """Raised when trying to cancel a registration that is already cancelled."""

    code = 'error.already_cancelled'


class DataInconsistencyError(WorkshopRegistrationError):
    """Raised when database invariants are violated (e.g., seats_taken is out of sync)."""
