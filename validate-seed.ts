import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

async function main() {
    console.log('🔌 Conectando ao banco de dados...')
    try {
        // 1. Validate Areas
        const areasCount = await prisma.area.count()
        console.log(`\n📊 AREAS: ${areasCount} encontradas (Esperado: >= 8)`)

        const area = await prisma.area.findFirst({
            where: { name: 'Societária' }
        })

        if (area && area.externalUrl) {
            console.log(`✅ Área 'Societária' OK | URL: ${area.externalUrl}`)
        } else {
            console.error(`❌ Falha na validação de Área 'Societária'. Encontrada: ${!!area}, URL: ${area?.externalUrl}`)
        }

        // 2. Validate Families
        const familiesCount = await prisma.productFamily.count()
        console.log(`\n📊 FAMILIES: ${familiesCount} encontradas (Esperado: >= 69)`)

        // 3. Validate Products (and relationship)
        const productsCount = await prisma.product.count()
        console.log(`\n📊 PRODUCTS: ${productsCount} encontrados (Esperado: >= 89)`)

        // Check one relationship
        const sampleProduct = await prisma.product.findFirst({
            where: { code: 'SOC.01.1' }, // "Planejamento Patrimonial Sucessório - Simplificado"
            include: { family: true }
        })

        if (sampleProduct && sampleProduct.family && sampleProduct.family.code === 'SOC.01') {
            console.log(`✅ Relacionamento Produto -> Família OK: ${sampleProduct.code} vinculado a ${sampleProduct.family.name}`)
        } else {
            console.error(`❌ Falha no relacionamento Produto -> Família.`)
            if (sampleProduct) console.log('Produto:', sampleProduct)
        }

        // 4. Validate ROOT User
        const rootUser = await prisma.user.findFirst({
            where: { role: 'ROOT' }
        })
        if (rootUser) {
            console.log(`\n✅ Usuário ROOT encontrado: ${rootUser.name} (${rootUser.email})`)
        } else {
            console.error(`\n❌ Usuário ROOT NÃO encontrado!`)
        }

        console.log('\n✨ Validação concluída com sucesso!')
    } catch (error) {
        console.error('\n❌ Erro na validação:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
