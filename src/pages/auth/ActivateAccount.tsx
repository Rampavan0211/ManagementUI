import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../ActivateAccount.css";

export default function ActivateAccount() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token =
    searchParams.get("token") || "";

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError(
        "Invalid activation link."
      );

      return;
    }

    if (!password) {
      setError(
        "Please enter a password."
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );

      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "https://localhost:7160/api/Auth/activate-account",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              token,
              password
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Account activation failed."
        );
      }

      setSuccess(
        "Account activated successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err: any) {
      setError(
        err.message ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activate-page">

      <div className="activate-card">

        <h2>
          Activate Your Account
        </h2>

        <p className="activate-description">
          Set your password to activate
          your administrator account.
        </p>

        {error && (
          <div className="activate-error">
            {error}
          </div>
        )}

        {success && (
          <div className="activate-success">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          <div className="activate-form-group">

            <label>
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter new password"
            />

          </div>

          <div className="activate-form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm password"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="activate-button"
          >
            {loading
              ? "Activating..."
              : "Activate Account"}
          </button>

        </form>

      </div>

    </div>
  );
}