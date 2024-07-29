"use client"
import { useAuth } from '@/app/context/AuthContext';
import { signIn, confirmSignIn, getCurrentUser, fetchAuthSession} from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Amplify } from "aws-amplify";
import amplifyConfig from '@/awsConfig';
Amplify.configure(amplifyConfig);



const AdminLoginPage = () => {
    const [usernameValue, setUsernameValue] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();
    const { setUser } = useAuth();
    const [needsConfirmation, setNeedsConfirmation] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    useEffect(() => {
        const checkIfUserIsSignedIn = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    const session = await fetchAuthSession();
                    setUser({ username: user.username, session });
                    router.push('/admin');
                }
            } catch (err) {
                console.log('No user signed in');
            }
        };
        checkIfUserIsSignedIn();
    }, [setUser, router]);
    const handleLogin = async (event, usernameValue, password) => {
        event.preventDefault();
        setError(null)
        try {
            const { isSignedIn, nextStep } = await signIn({ username: usernameValue, password: password });
            console.log(nextStep)
            if (nextStep["signInStep"] === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
                setNeedsConfirmation(true)
            } else if (isSignedIn) {
                const { username } = await getCurrentUser();
                const { tokens: session } = await fetchAuthSession();
                console.log("Logged in: " + username)
                setUser({ username, session });
                router.push('/admin');
            }
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
            console.error(err)
        }
    };

    const handleConfirmation = async (event, usernameValue, password) => {
        event.preventDefault();
        setError(null)

        try {
            const {isSignedIn2, nextStep} = await confirmSignIn({ challengeResponse: newPassword })
            console.log(nextStep)
            if (nextStep["signInStep"] === "DONE") {
                const { username } = await getCurrentUser();
                const { tokens: session } = await fetchAuthSession();
                console.log("Logged in: " + username)
                setUser({ username, session });
                router.push('/admin');
            }
        } catch (err) {
            setError('Failed to login: ' + err);
            console.error(err)
        }
    }
    return (
        <div className="w-screen flex justify-center">
            <div className="w-[80vw] lg:w-[40vw] bg-graylt mt-20 lg:mt-28 rounded-xl p-8 flex-col items-center shadow-lg">
                {(!needsConfirmation) &&
                    <>
                        <h1 className="text-center font-bold text-xl">Admin Login</h1>
                        <p className="text-center my-4">Please enter your credentials to access the admin dashboard.</p>
                        <form onSubmit={(e) => handleLogin(e, usernameValue, password)} className="w-full flex-col flex items-center mt-8">
                            <input value={usernameValue}
                                onChange={(e) => {
                                    setUsernameValue(e.target.value)
                                    console.log(usernameValue)
                                }}
                                type="text"
                                className="w-4/5 p-2 rounded mb-6"
                                placeholder="Your username" required />
                            <input value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="w-4/5 p-2 rounded mb-6"
                                placeholder="Your password"
                                required />
                            <button type="submit" className="bg-graydark text-white p-2 w-4/5 rounded hover:bg-graymd transition duration-300">Log In</button>
                        </form>
                        <p className='text-center text-sm text-red mt-4'>{error}</p>
                    </>}
                {(needsConfirmation) &&
                    <>
                        <h1 className="text-center font-bold text-xl">Create A New Password</h1>
                        <p className="text-center my-4">Please enter a new password to authenticate your account.</p>
                        <form onSubmit={(e) => handleConfirmation(e, usernameValue, password)} className="w-full flex-col flex items-center mt-8">
                            <input value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type="password"
                                className="w-4/5 p-2 rounded mb-6"
                                placeholder="Your new password"
                                required />
                            <button type="submit" className="bg-graydark text-white p-2 w-4/5 rounded hover:bg-graymd transition duration-300">Set New Password</button>
                        </form>
                        <p className='text-center text-sm text-red mt-4'>{error}</p>
                    </>}
            </div>
        </div>
    );
}

export default AdminLoginPage;