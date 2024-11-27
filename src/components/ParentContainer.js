import React, { useEffect, useState } from 'react';

const ParentContainer = () => {
    const [iframeHeight, setIframeHeight] = useState(600); // Initial iframe height
    const allowedDomain = 'athenahealth.bainsight.com'; // Allowed domain defined internally
    const [isIframeVisible, setIsIframeVisible] = useState(false); // State for iframe visibility

    // Function to validate the origin against the allowed domain
    const isAllowedOrigin = (origin) => {
        const regex = new RegExp(`^https?://([a-z0-9-]+\\.)?${allowedDomain.replace('.', '\\.')}(:\\d+)?(\/.*)?$`, 'i');
        return regex.test(origin);
    };

    /**
     * Function to handle iframe messages and validate the origin.
     * 
     * This function listens for messages sent from the iframe and ensures that 
     * only messages from the allowed domain and its subdomains are processed. 
     * The allowed domain is dynamically defined by the `allowedDomain` variable, 
     * which could be:
     * 
     * - `https://athenahealth.bainsight.com`: The base domain.
     * - Any subdomains, such as `https://sub.athenahealth.bainsight.com`.
     * - Specific paths like `/AthenaSearch/pages/results.html` and optional query strings.
     * - Requests with custom ports, e.g., `https://athenahealth.bainsight.com:8080`.
     * 
     * Validation is performed using a regular expression dynamically constructed 
     * from the `allowedDomain` variable. This ensures:
     * - Protocol: Only `https` is allowed (secure protocol).
     * - Domain: Must end with the value of `allowedDomain`.
     * - Optional subdomains, paths, and query strings.
     * - Optional port numbers.
     * 
     * If the origin is valid and the message type is `iframeHeight`, the iframe's height
     * will be updated dynamically based on the value provided in the message.
     * 
     * Important notes:
     * - Unauthorized origins, such as those from unrelated domains or malicious sites, are ignored.
     * - This ensures the iframe's parent container is not manipulated by external or malicious actors.
     * - The validation is case-insensitive and accepts any valid structure within the allowed domain.
     * 
     * @param {MessageEvent} event - The message event object sent from the iframe.
     */
    const handleMessageAllowedOrigin = (event) => {
        if (!isAllowedOrigin(event.origin)) return; // Validate the origin
        if (event.data.type === 'iframeHeight') {
            setIframeHeight(event.data.height); // Adjust the iframe height
        }
    };

    // Function to handle iframe messages (for localhost validation)
    const handleMessage = (event) => {
        if (event.origin !== 'http://localhost:3000') return;
        if (event.data.type === 'iframeHeight') {
            setIframeHeight(event.data.height); // Adjust the iframe height
        }
    };

    // Function to toggle iframe visibility
    const toggleIframeVisibility = () => {
        setIsIframeVisible(!isIframeVisible);
        document.body.style.overflow = !isIframeVisible ? 'hidden' : ''; // Apply or remove overflow hidden
    };

    useEffect(() => {
        const messageListener = (event) => handleMessage(event);
        window.addEventListener('message', messageListener);

        return () => {
            window.removeEventListener('message', messageListener);
        };
    }, []);

    return (
        <div>
            <div className='header-panel'>
                <h1>GIF Search</h1>
                <button type="button" className="btn btn-secondary" onClick={toggleIframeVisibility}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"></path>
                    </svg>
                </button>
            </div>
            {isIframeVisible && ( // Render the iframe only if isIframeVisible is true
                <div>
                    <iframe
                        src="http://localhost:3000"
                        title="GIF Search"
                        style={{
                            width: '100%',
                            height: `${iframeHeight}px`,
                            border: '1px solid #ccc',
                            transition: 'height 0.3s ease', // Smooth height transition
                            overflow: 'hidden', // Evita scroll interno en el iframe (el scroll es del contenido)
                        }}
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default ParentContainer;
