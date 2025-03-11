import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export type AuthResponse = {
  success: boolean;
  error?: string;
  userId?: string;
  userEmail?: string | null;
  emailVerified?: boolean;
};

// Function to refresh the token
export const refreshToken = async (): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    // Force token refresh
    return await currentUser.getIdToken(true);
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Immediately get a fresh token to ensure long session
    await userCredential.user.getIdToken(true);

    // Return only primitive values, no objects
    return {
      success: true,
      userId: userCredential.user.uid,
      userEmail: userCredential.user.email,
      emailVerified: userCredential.user.emailVerified,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    let errorMessage = "Failed to sign in";

    if (error instanceof Error) {
      // Handle Firebase specific errors
      if (error.message.includes("auth/wrong-password")) {
        errorMessage = "Invalid email or password";
      } else if (error.message.includes("auth/user-not-found")) {
        errorMessage = "No account found with this email";
      } else if (error.message.includes("auth/invalid-email")) {
        errorMessage = "Invalid email address";
      } else if (error.message.includes("auth/too-many-requests")) {
        errorMessage =
          "Too many failed login attempts. Please try again later.";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};
