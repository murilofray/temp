export interface JwtPayload {
    id: number;
    escolaId: number;
    nome: string;
    nivelAcesso: string[];
    iat: number;
    exp: number;
}