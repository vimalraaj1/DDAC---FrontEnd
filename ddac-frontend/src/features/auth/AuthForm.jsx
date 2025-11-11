import { useState } from "react";

export default function AuthForm({title, fields, onSubmit}){
    const [formData, setFormData] = useState(() => {
        const initial = {};
        fields.forEach(f => initial[f.name] = "");
        return initial;
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="auth-container">
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
                {fields.map((field)=>(
                    <div key={field.name} className="input-group">
                        <label>{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}

                <button type="submit">{title}</button>
            </form>
        </div>
    );
}