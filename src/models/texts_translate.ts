/**
 * Data Interface for translate Texts.
 */
export interface Texts {
    app: App;
    validate_token: Validate_Token;
    validate_admin: Validate_Admin;
    auth_controller: Auth_Controller;
    user_controller: User_Controller;
}

// FILES INTERFACES
/**
 * Server Configurations
 */
interface App {
    not_allowed_by_cors: string;
    not_finded_route: string;
}

/**
 * Middlewares
 */
interface Validate_Token {
    denied_access: string;
    secret_not_defined: string;
    invalid_token: string;
}
interface Validate_Admin {
    is_not_admin: string;
    not_user_info_error: string;
}

/**
 * Controllers
 */
interface Auth_Controller {
    joi: {
        nameUser: {
            string_base: string;
            string_min: string;
            string_max: string;
            required: string;
        },
        passUser: {
            string_base: string;
            string_min: string;
            string_max: string;
            required: string;
        },
    },
    wrong_form_data_error: string;
    inactive_user: string;
    inactive_user_error: string;
    nonexistent_user: string;
    nonexistent_user_error: string;
    wrong_password: string;
    wrong_password_error: string;
    secret_not_defined: string;
    secret_not_defined_error: string;
    clg_successfully_logged_in: string;
    successfully_logged_in: string;
}
interface User_Controller {
    joi: {
        nameUser: {
            string_base: string;
            string_min: string;
            string_max: string;
            required: string;
        },
        passUser: {
            string_base: string;
            string_min: string;
            string_max: string;
            required: string;
        },
        roleUser: {
            number_base: string;
            number_integer: string;
            number_min: string;
            number_max: string;
            required: string;
        },
    },
    wrong_form_data_error: string;
    previously_registered_user: string;
    previously_registered_user_error: string;
    clg_new_user: string;
    new_registered_user: string;
}