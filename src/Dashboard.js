import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { useStytch, useStytchSession } from '@stytch/react';
import logo from './logo.png';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';
import Spinner from './Spinner';
import { server, services } from './config';

function Dashboard() {
    const [email, setEmail] = useState("user@gmail.com");

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [apiKey, setApiKey] = useState(null);
    const navigate = useNavigate();
    const stytch = useStytch();
    const session = useStytchSession();
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticating = useRef(false);
    const [newEmail, setNewEmail] = useState('');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const location = useLocation();
    const [showPaymentStatus, setShowPaymentStatus] = useState(false);
    const [redirectStatus, setRedirectStatus] = useState('');
    const [setupIntentClientSecret, setSetupIntentClientSecret] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [createCustomerOnEmailUpdate, setCreateCustomerOnEmailUpdate] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [loadingTasks, setLoadingTasks] = useState(new Set());
    const [isDocumentationExpanded, setIsDocumentationExpanded] = useState(false);
    const [storedCustomerIntake, setStoredCustomerIntake] = useState('');
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [intakeSubmitted, setIntakeSubmitted] = useState(false);
    const [currentIntake, setCurrentIntake] = useState('');

    // MARK: UI

    const addLoadingTask = useCallback((taskName) => {
        setLoadingTasks(prev => new Set(prev).add(taskName));
    }, []);

    const removeLoadingTask = useCallback((taskName) => {
        setLoadingTasks(prev => {
            const newSet = new Set(prev);
            newSet.delete(taskName);
            return newSet;
        });
    }, []);

    const handleSetupIntentRedirect = async() => {
        addLoadingTask("handleSetupIntentRedirect");
        const params = new URLSearchParams(location.search);
        const redirectStatus = params.get('redirect_status');
        const setupIntentClientSecret = params.get('setup_intent_client_secret');
        const redirectCustomerId = params.get('customerId');

        if (redirectStatus && setupIntentClientSecret && redirectCustomerId) {
            setShowPaymentStatus(true);
            setRedirectStatus(redirectStatus);
            setSetupIntentClientSecret(setupIntentClientSecret);
            setCustomerId(redirectCustomerId);
        }

        removeLoadingTask("handleSetupIntentRedirect");
    }

    const setCustomerIntakeData = async (customerApiKey) => {
        const response = await fetch(`${server.url}/api/intake/?email=${email}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'x-api-key': customerApiKey
            }
        });

        const jsonResponse = await response.json()
        setStoredCustomerIntake(jsonResponse.data.customerData)
        setCurrentIntake(jsonResponse.data.customerData)
    }

    const setCustomerData = async () => {
        addLoadingTask("setCustomerData");
        if (email === "user@gmail.com") {
            // default email
            console.log("email not set before running get customer data")
            
            removeLoadingTask("setCustomerData");
            return
        }

        console.log("email is set to ", email, " getting customer data")
        const response = await fetch(`${server.url}/api/users/customer/?email=${email}`, {
            method: 'GET'
        });

        const jsonResponse = await response.json()
        if (jsonResponse.data.message) {
            console.log("error getting customer data ", jsonResponse.data.message)
            if (isLoading) {
                setIsLoading(false);
            }

            removeLoadingTask("setCustomerData");
            return
        }

        setPaymentMethod(jsonResponse.data.paymentMethodLast4)
        
        const dispatchQueue = async (someKey) => {
            await setApiKey(jsonResponse.data.apiKey)
            return jsonResponse.data.apiKey
        }
        
        dispatchQueue().then(async (customerApiKey) => {
            await setCustomerIntakeData(customerApiKey)
        })
        removeLoadingTask("setCustomerData");

    }

    // MARK: Networking
    const createCustomer = async () => {
        addLoadingTask("createCustomer");
        if (!customerId || !email) {
            console.log("customer and email required to make customer")
            removeLoadingTask("createCustomer");
            return
        }

        try {
            fetch(`${server.url}/api/users/create-customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    customerId
                })
            })
            .then(response => response.json())
            .then(jsonResponse => {
                if (jsonResponse.message) {
                    // Show error message to the user
                    setErrorMessage(jsonResponse.message);
                    alert(jsonResponse.message); // Alert the user
                    // Refresh the page after acknowledgment
                    window.location.reload();
                    removeLoadingTask("createCustomer");
                    return;
                }

                const newCustomerId = jsonResponse.data.customerId;
                const newApiKey = jsonResponse.data.apiKey;
                const newPaymentMethodLast4 = jsonResponse.data.paymentMethodLast4;

                setCustomerId(newCustomerId);
                setApiKey(newApiKey);
                // setPaymentMethod(newPaymentMethodLast4);
                setCreateCustomerOnEmailUpdate(false);

                // Call setCustomerData after successful response
                setCustomerData();
                removeLoadingTask("createCustomer");
            })
            .catch(error => {
                console.log("error creating customer ", error);
                removeLoadingTask("createCustomer");
            });
        } catch (error) {
            console.error("Error creating customer:", error);
            removeLoadingTask("createCustomer");
        }
    }

    const getPaymentMessage = () => {

        switch (redirectStatus) {
            case 'succeeded':
                return { message: 'Success! Your payment method has been saved. You are on the waitlist for our API. We will inform you when it becomes available for use.', style: { color: '#4CAF50' }}; // Dark green
            case 'processing':
                return { message: "Processing payment details. We'll update you when processing is complete.", style: { color: '#FFA500' } }; // Dark orange
            case 'requires_payment_method':
                return { message: 'Failed to process payment details. Please try another payment method.', style: { color: '#FF6347' } }; // Lightly dark red
            default:
                return { message: 'Your payment setup was not successful. Technical error, please contact support.', style: {} };
        }

    };

    const { message, style } = getPaymentMessage();

    // MARK: Handlers
    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            try {
                await stytch.session.revoke();
                navigate('/');
            } catch (error) {
                console.error('Error logging out:', error);
                alert('Failed to log out. Please try again.');
            }
        }
    };

    const handleAddPaymentMethod = () => {
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
    };

    const setCustomerEmail = async () => {
        stytch.user.get()
            .then((response) => {
                const sessionEmail = response.emails[0].email
                setEmail(sessionEmail)
            })
    }

    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(apiKey).then(() => {
          alert('API Key copied to clipboard!');
        });
    };

    const handleSubmitIntake = async () => {
        setIsSubmitting(true);
        try {
            const sendUpdate = Boolean(storedCustomerIntake && currentIntake !== storedCustomerIntake)
            const updateKey = sendUpdate ? 'intake' : 'customerData';
            const endpoint = `${server.url}/api/intake/?email=${email}`
            const method = sendUpdate ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'x-api-key': `${apiKey}`,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    [updateKey]: currentIntake
                })
            });
            const data = await response.json();
            
            if (data.data) {
                setCurrentIntake(data.data);
                setStoredCustomerIntake(data.data);
                setIntakeSubmitted(Boolean(JSON.stringify(data.data)));
            }

        } catch (error) {
            console.error('Error submitting intake:', error);
            setErrorMessage('Failed to submit intake. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // MARK: State Management
    useEffect(() => {
        const isStoredCustomerDataValid = storedCustomerIntake ? storedCustomerIntake.length >= 50 : false;
        const isCurrentIntakeValid = currentIntake ? currentIntake.length >= 50 : false;
        const hasChanged = storedCustomerIntake !== currentIntake;
        setIsSubmitEnabled(isStoredCustomerDataValid && isCurrentIntakeValid && hasChanged && !isSubmitting);
    }, [storedCustomerIntake, currentIntake]);

    useEffect(() => {
        const fetchCurrentIntake = async () => {
            if (!email || !apiKey) return;

            try {
                const response = await fetch(`${server.url}/api/intake/?email=${email}`, {
                    method: 'GET',
                    headers: {
                        'content-type': 'application/json',
                        'x-api-key': apiKey
                    }
                });
                const data = await response.json();
                if (data.data.customerData.data) {
                    setCurrentIntake(data.data.customerData.data);
                    setStoredCustomerIntake(data.data.customerData.data);
                }
            } catch (error) {
                console.error('Error fetching current intake:', error);
            }
        };

        fetchCurrentIntake();
    }, [email, apiKey]);

    // MARK: Use Effects
    // Set up stripe
    useEffect(() => {
        console.log("loading stripe")
        try {
            setStripePromise(loadStripe(String(services.stripe)));
        } catch (error) {
            console.log("error loading stripe ", error)
        }
    }, []);

    useEffect(() => {
        fetch(`${server.url}/api/payments/stripe-customer-client-secret`, {
          method: "GET"
        }).then(async (response) => {
          const JSONResponse = await response.json();
          const responseClientSecret = JSONResponse.data.clientSecret
          const responseCustomerId = JSONResponse.data.customerId
          setClientSecret(responseClientSecret);
          setCustomerId(responseCustomerId)
        }).catch((error) => {
            console.error("Error fetching customer details:", error);
            setErrorMessage("Failed to fetch customer details. Please try again.");
            if (isLoading) {
                setIsLoading(false);
            }
        })
    }, []);

    // Authenticate user
    useEffect(() => {
        addLoadingTask("authenticateUser");
        if (isAuthenticating.current) {
            removeLoadingTask("authenticateUser");
            return;
        }

        isAuthenticating.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (session.session) {
            // Fetch user's email from the session
            stytch.user.get()
                .then((response) => {
                    const sessionEmail = response.emails[0].email
                    setEmail(sessionEmail)
                })
                .catch((error) => {
                    console.error("Error fetching customer details:", error);
                    setErrorMessage("Failed to fetch customer details. Please try again."); // Step 2: Set error message
                })
                .finally(() => {
                    isAuthenticating.current = false;
                    setIsLoading(false);
                    removeLoadingTask("authenticateUser");
                });

            return;
        }

        if (token && !session.session) {
            stytch.magicLinks.authenticate(token, {
                session_duration_minutes: 60
            }).then(() => {
                console.log("Token authentication successful");
                return stytch.user.get();
            }).then((response) => {
                setEmail(response.emails[0].email)
            }).catch((error) => {
                console.error("Authentication failed:", error);
                setErrorMessage("Authentication failed. Please check your token and try again."); // Step 3: Set error message
                navigate('/register');
            }).finally(() => {
                if (isLoading || isAuthenticating.current) {
                    setIsLoading(false);
                    isAuthenticating.current = false;
                }
                removeLoadingTask("authenticateUser");
            });
        } else {
            removeLoadingTask("authenticateUser");
            console.log("No token and no session, redirecting to register");
            navigate('/register');
        }

    }, [session, navigate]);

    // Handle redirect from Stripe
    useEffect(() => {

        const dispatchQueue = async () => {
            await handleSetupIntentRedirect();
            if (redirectStatus === 'succeeded') {
                if (!apiKey) { // API Key is only set in the current user is a customer
                    setCreateCustomerOnEmailUpdate(true)
                } else {
                    console.log("has api key, probably updating payment method")
                }
            }
        }

        dispatchQueue()
    }, [redirectStatus, location]);

    useEffect(() => {
        if (createCustomerOnEmailUpdate) {
            createCustomer()
        }

        setCustomerData()
    }, [email])


    // Commented out email update function
    /*
    const handleEmailUpdate = async () => { // Step 2: Function to update email
        try {
            await stytch.user.update({ emails: [{ email: newEmail }] }); // Update email via Stytch API
            setEmail({ ...user, email: newEmail }); // Update local user state
            setIsEditingEmail(false); // Close modal
        } catch (error) {
            console.error("Error updating email:", error);
            alert('Failed to update email. Please try again.');
        }
    };
    */

    const isSpinnerVisible = loadingTasks.size > 0;

    return (
        <div className="Dashboard">
            {isSpinnerVisible && <Spinner />}
            {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Error message display */}
            <header>
                <h1>Account Overview</h1>
                <img src={logo} alt="Flock Logo" style={{ width: '10%', height: 'auto' }} />
            </header>
            <section className="dashboard-section service-details">
                <h2>SERVICE DETAILS</h2>
                <ul>
                    <li>$X per widget</li>
                </ul>
            </section>
            {paymentMethod && apiKey && <section className="dashboard-section intake">
                <h2>INTAKE</h2>
                <div className="intake-field">
                    <label htmlFor="storedCustomerIntake">What your customers need to tell you about what they need done...</label>
                    <textarea
                        id="storedCustomerIntake"
                        value={currentIntake}
                        onChange={(e) => setCurrentIntake(e.target.value)}
                        maxLength={500}
                        placeholder="Example of the ideal intake information from your ideal customer (min character length of your customer's intake)"
                    />
                    <div className="char-count">
                        <span>{currentIntake.length}</span>/500
                    </div>
                </div>
                <button 
                    onClick={handleSubmitIntake} 
                    disabled={!isSubmitEnabled || isSubmitting}
                    className={`submit-button ${isSubmitEnabled ? 'enabled' : 'disabled'}`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Intake'}
                </button>
                {isSubmitting && <Spinner />}
                {intakeSubmitted && <p className="success-message">Intake submitted successfully!</p>}
            </section>}
            <section className="dashboard-section account-details">
                <h2>ACCOUNT DETAILS</h2>
                <p>{email}</p>
                {paymentMethod && (
                    <p style={{ color: 'orange', fontWeight: 'bold' }}>Waitlisted</p>
                )}
                {/* Commented out email editing form
                {isEditingEmail && ( // Step 4: Modal or input for email
                    <div>
                        <input 
                            type="email" 
                            value={newEmail} 
                            onChange={(e) => setNewEmail(e.target.value)} 
                            placeholder="Enter new email" 
                        />
                        <button onClick={handleEmailUpdate}>Update Email</button>
                        <button onClick={() => setIsEditingEmail(false)}>Cancel</button>
                    </div>
                )}
                */}
            </section>
            {/* <section className="dashboard-section api-key">
                <h2>API KEY</h2>
                <p>
                    {paymentMethod
                        ? 'Your API key'
                        : 'Please add credit card information in order to get access to your API key.'}
                </p>
                {paymentMethod && (
                    <div className="api-key-container">
                        <input
                            type="password"
                            value={apiKey}
                            readOnly
                            className="api-key-input"
                        />
                        <button onClick={handleCopyApiKey}>Copy API Key</button>
                    </div>
                )}
                {!paymentMethod && <p className="api-key-value">No API key available.</p>}
            </section> */}
            {showPaymentStatus && <div className="payment-status">Payment Status</div>} {/* Show payment status message */}
            {message && showPaymentStatus && <div style={style}>{message}</div>} {/* Display the payment message */}

            {showPaymentModal && stripePromise && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm onSuccess={handlePaymentSuccess} customerId={customerId} />
                </Elements>
            )}
            <section className="dashboard-section billing-and-payments">
                <h2>BILLING AND PAYMENTS</h2>
                <div className="payment-methods">
                {paymentMethod ? (
                    <>
                            <p>Payment method: **** **** **** {paymentMethod} <br />
                            <p style={{ color: 'black' }}>
                                To delete your account or change your payment method, please email
                                info@yourMvpDomain.com.
                            </p>
                            </p>
                    </>
                ) : (
                    <p onClick={handleAddPaymentMethod} className="add-payment-method">+ Add payment method</p>
                )}

                </div>
            </section>

            <section className="dashboard-section documentation">
                <h2 onClick={() => setIsDocumentationExpanded(!isDocumentationExpanded)} style={{cursor: 'pointer'}}>
                    DOCUMENTATION {isDocumentationExpanded ? '▲' : '▼'}
                </h2>
                {isDocumentationExpanded && (
                    <div className="documentation-content">
                        <p>Not yet available</p>
                    </div>
                )}
            </section>

            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
}

export default Dashboard;