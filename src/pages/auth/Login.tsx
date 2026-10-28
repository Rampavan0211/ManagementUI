import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../Login.css";

import api from "../../api/axiosInstance";
import type { LoginResponse } from "../../types/auth";

const Login = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // STEP 1 - CHECK EMAIL
  const handleEmailCheck = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/Auth/check-email", {
        email: email.trim(),
      });

      setStep(2);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError("Invalid Email.");
      } else if (error.response?.status === 403) {
        setError("Your account is inactive.");
      } else {
        setError("Unable to verify email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 - LOGIN
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post<LoginResponse>(
        "/Auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/");
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("Invalid password.");
      } else if (error.response?.status === 403) {
        setError("Your account is inactive.");
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // SIGN IN WITH ANOTHER USER
  const handleAnotherUser = () => {
    setStep(1);
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100">

      <div className="login-card card border-0 shadow">

        <div className="card-body p-4 p-md-5">

          {/* HEADER */}
          <div className="text-center mb-4">

            <h2 className="fw-bold mb-2">
              Organisational Management
            </h2>

            {/* <p className="text-muted mb-0">
              Sign in to your account
            </p> */}

          </div>

          {/* STEP 1 */}
          {step === 1 && (

            <form onSubmit={handleEmailCheck}>

              <div className="mb-2">

                <label
                  htmlFor="email"
                  className="form-label fw-semibold"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  className={`form-control form-control-lg ${
                    error ? "is-invalid" : ""
                  }`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  autoFocus
                  required
                />

              </div>

              {/* ERROR */}
              {error && (
                <div className="text-danger small mt-2 mb-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Checking..." : "Continue"}
              </button>

            </form>

          )}

          {/* STEP 2 */}
          {step === 2 && (

            <form onSubmit={handleLogin}>

              {/* EMAIL */}
              <div className="mb-1">

                <label
                  htmlFor="loginEmail"
                  className="form-label fw-semibold"
                >
                  Email
                </label>

                <input
                  id="loginEmail"
                  type="email"
                  className="form-control form-control-lg"
                  value={email}
                  disabled
                />

              </div>

              {/* ANOTHER USER */}
              <div className="text-end mb-4">

                <button
                  type="button"
                  className="btn btn-link p-0 small text-decoration-none"
                  onClick={handleAnotherUser}
                >
                  Sign in with another user
                </button>

              </div>

              {/* PASSWORD */}
              <div className="mb-1">

                <label
                  htmlFor="password"
                  className="form-label fw-semibold"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  className={`form-control form-control-lg ${
                    error ? "is-invalid" : ""
                  }`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  autoFocus
                  required
                />

              </div>

              {/* FORGOT PASSWORD */}
              <div className="text-end mb-3">

                <button
                  type="button"
                  className="btn btn-link p-0 small text-decoration-none"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>

              </div>

              {/* ERROR */}
              {error && (
                <div className="text-danger small mb-3">
                  {error}
                </div>
              )}

              {/* LOGIN BUTTON - LEFT */}
              <div className="text-start">

                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-5"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Login"}
                </button>

              </div>

            </form>

          )}

        </div>

      </div>

    </div>
  );
};

export default Login;
