import { fetchAPI } from "@/lib/utils";


/**
 * Checks the user's authentication level by making a request to the "/auth" endpoint.
 * If the request is successful and the authentication level is greater than or equal to the provided `accessLevel`,
 * the `onSuccess` callback is called with the authentication level as an argument.
 * Otherwise, the `onFailure` callback is called with the authentication level as an argument.
 * If the request fails, an error message is logged to the console.
 *
 * @param {number} accessLevel - The minimum authentication level required to be considered successful.
 * @param {(accessLevel: number) => void} onSuccess - The callback function to be called if the authentication level is successful.
 * @param {(accessLevel: number) => void} onFailure - The callback function to be called if the authentication level is not successful.
 * @return {void} This function does not return anything.
 */
export function checkAuth(accessLevel: number, onSuccess: (accessLevel: number) => void, onFailure: (accessLevel: number) => void) {
    fetchAPI("/auth", {
        credentials: "include",
    })
        .then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    if (data <= accessLevel) {
                        onSuccess(data);
                    } else {
                        onFailure(data);
                    }
                })
            } else {
                onFailure(accessLevel);
            }
        })
        .catch((error) => {
            console.error("Failed to check authentication", error);
            onFailure(accessLevel);
        });
}