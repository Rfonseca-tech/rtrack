
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function main() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const email = 'suporte@rfonseca.adv.br';
    const password = 'c83L$Yd0p41';

    console.log(`Creating user ${email}...`);

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            name: 'Suporte RTrack',
            role: 'ROOT'
        }
    });

    if (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }

    console.log('User created successfully:', data.user.id);
    console.log('Role set to ROOT via metadata.');

    // Double check if public.users sync trigger worked (or if we need to insert manually)
    // Assuming there is a trigger based on previous context, but let's just log for now.
}

main();
