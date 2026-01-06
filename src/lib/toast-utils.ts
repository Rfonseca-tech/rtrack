import { toast } from "sonner"

/**
 * Toast utility functions for consistent user feedback
 * 
 * Usage:
 * - showSuccess("Projeto criado com sucesso!")
 * - showError("Falha ao salvar. Tente novamente.")
 * - showLoading("Salvando...") → returns a dismiss function
 */

export function showSuccess(message: string, description?: string) {
    toast.success(message, {
        description,
        duration: 4000,
    })
}

export function showError(message: string, description?: string) {
    toast.error(message, {
        description,
        duration: 6000,
    })
}

export function showWarning(message: string, description?: string) {
    toast.warning(message, {
        description,
        duration: 5000,
    })
}

export function showInfo(message: string, description?: string) {
    toast.info(message, {
        description,
        duration: 4000,
    })
}

/**
 * Shows a loading toast and returns a function to update/dismiss it
 * 
 * Usage:
 * const toastId = showLoading("Salvando projeto...")
 * try {
 *   await saveProject()
 *   toast.success("Projeto salvo!", { id: toastId })
 * } catch {
 *   toast.error("Falha ao salvar", { id: toastId })
 * }
 */
export function showLoading(message: string) {
    return toast.loading(message)
}

/**
 * Wraps an async action with automatic toast feedback
 * 
 * Usage:
 * await withToast(
 *   () => createProject(data),
 *   {
 *     loading: "Criando projeto...",
 *     success: "Projeto criado com sucesso!",
 *     error: "Falha ao criar projeto"
 *   }
 * )
 */
export async function withToast<T>(
    action: () => Promise<T>,
    messages: {
        loading: string
        success: string
        error: string
    }
): Promise<T | null> {
    const toastId = toast.loading(messages.loading)

    try {
        const result = await action()
        toast.success(messages.success, { id: toastId })
        return result
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : messages.error
        toast.error(errorMessage, { id: toastId })
        return null
    }
}

/**
 * Action result toast handler for server actions
 * 
 * Usage:
 * const result = await createProject(data)
 * handleActionResult(result, "Projeto criado!", "Falha ao criar projeto")
 */
export function handleActionResult(
    result: { success: boolean; error?: string },
    successMessage: string,
    errorMessage?: string
) {
    if (result.success) {
        showSuccess(successMessage)
    } else {
        showError(result.error || errorMessage || "Ocorreu um erro")
    }
}
