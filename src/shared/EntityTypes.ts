import { useParams } from 'react-router-dom';

/**
 * Paginated list from backend
 */
export interface Page<T> {
    data: T[]
    total: number
    limit: number
}

/**
 * Single element from Backend encapsulated in data
 */
export interface Data<T> {
    data: T
}

/**
 * useParams hook adding casting to the desired type. This removes the possibility of params being
 * null. It can be safely used when the params are mandatory
 */
export function useRequiredParams<T>() {
    return useParams() as T
}

export interface EquipamientoDto {
    id: string
    provinciaId: string
    usuarioId: string
    observaciones: string
    fentrega: string
    fdevolucion: string
    marca: string
    modelo: string
    nserie: string
    nlargo: string
    ncorto: string
    imei: string
    icc: string
    pin: string
    puk: string
    datos: boolean
    voz: boolean
    cargador: boolean
    raton: boolean
    maletin: boolean
    auriculares: boolean
    idmId: string
    tipo: string
    estado: string
    valido: boolean
}

export interface BasicoDto {
    id: string
    descr: string
    valido: boolean
}

export interface FuncionalidadDto {
    id: string
    descr: string
    url: string
    moduloId: string
}
