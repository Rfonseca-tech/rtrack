/**
 * Verifica se o usuário pode editar/criar/excluir dados
 * Apenas ROOT e ADMIN têm permissão
 */
export function canManageData(role: string | undefined): boolean {
    return role === 'ROOT' || role === 'ADMIN'
}

/**
 * Verifica se o usuário pode criar novos projetos
 * ROOT, ADMIN e EMPLOYEE podem criar
 */
export function canCreateProject(role: string | undefined): boolean {
    return role === 'ROOT' || role === 'ADMIN' || role === 'EMPLOYEE'
}

/**
 * Verifica se o usuário pode editar suas próprias configurações de login
 * Apenas ROOT pode editar o próprio login (ADMIN não pode)
 */
export function canEditOwnAuth(role: string | undefined): boolean {
    return role === 'ROOT'
}
