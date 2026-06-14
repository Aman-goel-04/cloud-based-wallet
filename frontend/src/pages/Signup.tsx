import axios from "axios";
import { useState } from "react";
import { instance } from "../api/client";
import { useNavigate } from "react-router-dom";

function Signup() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [publicKey, setPublicKey] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};
	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();

		type responseType = {
			publicKey: string;
		};
		try {
			const response = await instance.post<responseType>("/signup", {
				// public key will be retrned
				username: formData.username,
				password: formData.password,
			});
			setPublicKey(response.data.publicKey);
			navigate("/signin");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				alert(error.response?.data?.message ?? "Something went wrong");
			} else {
				alert("Something went wrong");
			}
		}
	};

	return (
		<>
			{publicKey && <p>Your wallet address: {publicKey}</p>}
			{!publicKey && (
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
						<button type="submit"> Sign Up </button>
					</form>
					<div>
						<button
							onClick={() => {
								navigate("/signin");
							}}
						>
							Already have an account?
						</button>
					</div>
				</>
			)}
		</>
	);
}

export default Signup;
