export default class SecurityService{

    static async sha256(password: string, salt?: string): Promise<string> {
        const combinedMessage = salt ? password + salt : password;

        const msgBuffer = new TextEncoder().encode(combinedMessage);
        
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));           
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    }
    
    static async comparePasword(passwordToCompare: string, password: string): Promise<boolean> {
        const hashedPasswordToCompare = await this.sha256(passwordToCompare, process.env.SALT)
        return hashedPasswordToCompare === password ? true : false
    }
}