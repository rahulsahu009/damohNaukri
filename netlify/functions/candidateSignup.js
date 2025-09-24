// netlify/functions/candidateSignup.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
    // Public keys (public client)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Master key (admin client) - This is the new part
    const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY);

    // Get data from the form
    const { email, password, full_name, mobile, qualification } = JSON.parse(event.body);

    // Step 1: Create the user in Auth using the public client
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (authError) {
        return { statusCode: 400, body: JSON.stringify({ error: authError.message }) };
    }

    // Step 2: Insert the profile into the candidates table using the ADMIN client
    // The admin client bypasses RLS policies.
    const { error: dbError } = await supabaseAdmin
        .from('candidates')
        .insert([
            { id: authData.user.id, email: email, full_name: full_name, mobile_number: mobile, qualification: qualification }
        ]);

    if (dbError) {
        // If profile insert fails, we should ideally delete the user from auth as well
        // For now, just return the error
        return { statusCode: 500, body: JSON.stringify({ error: "Database error: " + dbError.message }) };
    }

    // If everything is successful
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Signup successful! Please check your email to verify." }),
    };
};