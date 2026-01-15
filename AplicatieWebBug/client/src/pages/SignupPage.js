import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/authApi';

// Pagina de inregistrare utilizator
function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('TST');
    const [loading, setLoading] = useState(false); // Pentru a preveni click-urile multiple
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Folosim 'await' pentru a astepta raspunsul serverului
            const response = await signup(email, password, role);
            
            console.log("Răspuns server la signup:", response);
            alert("Cont creat cu succes! Acum te poți loga.");
            navigate('/login');
        } catch (error) {
            console.error("Eroare la înregistrare:", error);
            alert("Eroare: Nu s-a putut crea contul. Verifică terminalul serverului.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card-container">
            <form onSubmit={handleSignup} className="auth-card">
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Înregistrare</h2>
                
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Parolă:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <label>Rol:</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        disabled={loading}
                    >
                        <option value="TST">Student Tester (TST)</option>
                        <option value="MP">Membru Proiect (MP)</option>
                    </select>
                </div>
                
                <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={loading}
                >
                    {loading ? "Se salvează..." : "Înregistrare"}
                </button>
            </form>
        </div>
    );
}

export default SignupPage;