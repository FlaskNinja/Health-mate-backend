export function vallidateAllBodyFields(body, requiredFields) {
    for (const field of requiredFields) {
        if (!body[field]) {
            return {
                status: false,
                message: `Missing Required Fields: ${field}`
            }
        }
    }

    return { status: true,
        message: "All fields are present"
    };
}