export interface Alergia {
    id: number;
    descricao: string;
    tipoAlergiaId: number;
    tipoAlergia: {
        descricao: string;
    };
}
