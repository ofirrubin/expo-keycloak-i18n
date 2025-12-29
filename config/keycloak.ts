export const KEYCLOAK_CONFIG = {
    url: process.env.EXPO_PUBLIC_KEYCLOAK_URL!,
    realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM!,
    clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID!,
    enablePasswordGrant: process.env.EXPO_PUBLIC_AUTH_WITH_PASSWORD === 'true',
};

if (!KEYCLOAK_CONFIG.url || !KEYCLOAK_CONFIG.realm || !KEYCLOAK_CONFIG.clientId) {
    console.error('Missing Keycloak configuration. Check your .env file.');
}

export const getKeycloakEndpoints = () => {
    const baseUrl = KEYCLOAK_CONFIG.url.replace(/\/$/, '');
    const realm = KEYCLOAK_CONFIG.realm;

    return {
        authorizationEndpoint: `${baseUrl}/realms/${realm}/protocol/openid-connect/auth`,
        tokenEndpoint: `${baseUrl}/realms/${realm}/protocol/openid-connect/token`,
        revocationEndpoint: `${baseUrl}/realms/${realm}/protocol/openid-connect/logout`,
    };
};
