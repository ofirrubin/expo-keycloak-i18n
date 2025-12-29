export const KEYCLOAK_CONFIG = {
    url: process.env.EXPO_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080/',
    realm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM || 'app',
    clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID || 'customer-app',
};

export const getKeycloakEndpoints = () => {
    const baseUrl = KEYCLOAK_CONFIG.url.replace(/\/$/, '');
    const realm = KEYCLOAK_CONFIG.realm;

    return {
        authorizationEndpoint: `${baseUrl}/realms/${realm}/protocol/openid-connect/auth`,
        tokenEndpoint: `${baseUrl}/realms/${realm}/protocol/openid-connect/token`,
        revocationEndpoint: `${baseUrl}/realms/${realm}/protocol/openid-connect/logout`,
    };
};
