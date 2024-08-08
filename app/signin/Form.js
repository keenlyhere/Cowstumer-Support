'use client'
import { useState } from "react";
import '../register/Form';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Form() {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ errors, setErrors ] = useState({});
  const [ showPassword, setShowPassword ] = useState(false);
  const router = useRouter();
  const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL;
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (password.length < 8 || password.length > 50) {
      newErrors.password = 'Password must be between 8 and 50 characters';
    }

    return newErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })


      if (response?.error) {
        setErrors({ general: 'Invalid email or password' });
      } else if (response.ok) {
        router.push('/');
      }
    } catch (error) {
        console.error('Error signing in:', error);
    }
  }

  const handleDemoLogin = async () => {
    try {
      const response = await signIn('credentials', {
        email: demoEmail,
        password: demoPassword,
        redirect: false,
      })

      if (response?.error) {
        setErrors({ general: 'Invalid email or password' });
      } else if (response.ok) {
        router.push('/');
      }
    } catch (error) {
        console.error('Error signing in:', error);
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              { showPassword ? <FaEyeSlash /> : <FaEye /> }
            </span>
          </div>
          { errors.password && <p className="error">{ errors.password }</p> }
          { errors.general && <p className="error">{ errors.general }</p>}
        </div>
        <button type="submit">Sign In</button>
      </form>
        <button className="button-demo" onClick={handleDemoLogin}>Sign In To Demo User</button>
    </div>
  )
}
