// Initialize Supabase client
const supabaseUrl = 'https://oaexeiprmaxjyyowoein.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZXhlaXBybWF4anl5b3dvZWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNzU3MjMsImV4cCI6MjA1ODc1MTcyM30.MYXRBEZc53AEVeFB512T7I1KqGVCGR74CCZctAaElEo'

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// Products functions
const productService = {
    // Get all products
    async getAllProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
    },

    // Get product by id
    async getProductById(id) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single()
        
        if (error) throw error
        return data
    },

    // Create new product with multiple images
    async createProduct({ name, description, category, price, imageFiles }) {
        try {
            let imageUrls = [];

            // Upload multiple images if provided
            if (imageFiles && imageFiles.length > 0) {
                for (const imageFile of imageFiles) {
                    const fileExt = imageFile.name.split('.').pop()
                    const fileName = `${Math.random()}.${fileExt}`
                    const filePath = `${fileName}`

                    const { error: uploadError } = await supabase.storage
                        .from('products')
                        .upload(filePath, imageFile)

                    if (uploadError) throw uploadError

                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(filePath)

                    imageUrls.push(publicUrl)
                }
            }

            // Insert product data
            const { data, error } = await supabase
                .from('products')
                .insert([
                    {
                        name,
                        description,
                        category,
                        price,
                        image_url: imageUrls[0], // Main image
                        additional_images: imageUrls.slice(1) // Additional images
                    }
                ])
                .select()

            if (error) throw error
            return data[0]

        } catch (error) {
            throw error
        }
    },

    // Update product with multiple images
    async updateProduct(id, updates) {
        try {
            let imageUrls = [];

            // Handle image uploads if provided
            if (updates.imageFiles && updates.imageFiles.length > 0) {
                for (const imageFile of updates.imageFiles) {
                    const fileExt = imageFile.name.split('.').pop()
                    const fileName = `${Math.random()}.${fileExt}`
                    const filePath = `${fileName}`

                    const { error: uploadError } = await supabase.storage
                        .from('products')
                        .upload(filePath, imageFile)

                    if (uploadError) throw uploadError

                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(filePath)

                    imageUrls.push(publicUrl)
                }

                // Update the image URLs in the updates object
                updates.image_url = imageUrls[0]
                updates.additional_images = imageUrls.slice(1)
                delete updates.imageFiles
            }

            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()

            if (error) throw error
            return data[0]
        } catch (error) {
            throw error
        }
    },

    // Delete product
    async deleteProduct(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)
        
        if (error) throw error
        return true
    }
}

// Orders functions
const orderService = {
    // Get all orders
    async getAllOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('order_date', { ascending: false })
        
        if (error) throw error
        return data
    },

    // Get order by id
    async getOrderById(id) {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single()
        
        if (error) throw error
        return data
    },

    // Create new order
    async createOrder(orderData) {
        const { data, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Update order status
    async updateOrderStatus(id, status) {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Delete order
    async deleteOrder(id) {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id)
        
        if (error) throw error
        return true
    }
}

// Auth functions
const authService = {
    // Login
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (error) throw error
        return data
    },

    // Logout
    async logout() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    // Get current session
    async getSession() {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        return session
    }
}

// Make services available globally
window.productService = productService;
window.orderService = orderService;
window.authService = authService;
window.supabase = supabase; 