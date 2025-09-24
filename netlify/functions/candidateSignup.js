// netlify/functions/signup.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
    // Netlify से अपने Supabase URL और Key को सुरक्षित रूप से प्राप्त करें
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // फ्रंटएंड से भेजे गए डेटा को पार्स करें
    const { email, password, full_name, mobile, qualification } = JSON.parse(event.body);

    // Supabase Auth का उपयोग करके नया यूज़र साइनअप करें
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (authError) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: authError.message }),
        };
    }

    // अगर Auth सफल होता है, तो यूज़र का डेटा 'candidates' टेबल में डालें
    const { error: dbError } = await supabase
        .from('candidates')
        .insert([
            { id: authData.user.id, email: email, full_name: full_name, mobile_number: mobile, qualification: qualification }
        ]);

    if (dbError) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Database error: " + dbError.message }),
        };
    }

    // सफलता का संदेश भेजें
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Signup successful! Please check your email to verify." }),
    };
};