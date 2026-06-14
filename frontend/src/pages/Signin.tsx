import axios from "axios";
import { useState } from "react";
import { instance } from "../api/client";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

function Signin() {
	const { login } = useAuth();

	const navigate = useNavigate();

	const [formData, setFormData] = useState({ username: "", password: "" });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};
	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		type responseType = {
			jwt: string;
			publicKey: string;
		};
		try {
			const response = await instance.post<responseType>("/signin", {
				username: formData.username,
				password: formData.password,
			});

			const { jwt, publicKey } = response.data;
			login(jwt, publicKey);
			navigate("/dashboard");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				alert(error.response?.data?.message ?? "Incorrect credentials");
			} else {
				alert("Something went wrong");
			}
		}
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					name="username"
					type="text"
					value={formData.username}
					onChange={handleChange}
				/>
				<input
					name="password"
					type="password"
					value={formData.password}
					onChange={handleChange}
				/>
				<button type="submit"> Sign In </button>
			</form>
		</>
	);
}

export default Signin;
