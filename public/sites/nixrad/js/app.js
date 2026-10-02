/* ============================================
   NIXRAD - Premium JavaScript
   ============================================ */

// ============================================
// Configuration
// ============================================
const CONFIG = {
    PRODUCTS_PER_PAGE: 12,
    ANIMATION_THRESHOLD: 0.1,
    SCROLL_OFFSET: 100
};

// ============================================
// i18n - Internationalization
// ============================================
const translations = {
    tr: {
        // Navigation
        nav_home: 'Ana Sayfa',
        nav_products: 'Ürünler',
        nav_about: 'Hakkımızda',
        nav_dealers: 'Satış Noktaları',
        nav_contact: 'İletişim',
        nav_catalog: '2025 Katalog',

        // Hero
        hero_label: 'Premium Isıtma Çözümleri',
        hero_title: 'Mekanlarınıza <span>Lüks</span> ve Sıcaklık Katın',
        hero_text: 'Yüksek teknoloji ve estetik tasarımın buluştuğu dekoratif radyatör ve havlupan koleksiyonumuzu keşfedin. 10 yıl garanti, 50 bar test.',
        hero_btn_products: 'Koleksiyonu Keşfet',
        hero_btn_catalog: 'Kataloğu Görüntüle',
        hero_stat_warranty: 'Yıl Garanti',
        hero_stat_pressure: 'Bar Test',
        hero_stat_products: 'Ürün',

        // Categories
        cat_section_label: 'Kategoriler',
        cat_section_title: 'Ürün Koleksiyonumuz',
        cat_section_text: 'Her mekan için özel tasarlanmış premium ısıtma çözümleri',
        cat_radiators: 'Hibrit Radyatörler',
        cat_towel: 'Havlupanlar',
        cat_mirror: 'Aynalı Radyatörler',
        cat_products: 'ürün',

        // Features
        feat_warranty: '10 Yıl Garanti',
        feat_warranty_text: 'Tüm ürünlerimiz 10 yıl garantilidir',
        feat_quality: 'Premium Kalite',
        feat_quality_text: '50 bar test ile üstün dayanıklılık',
        feat_shipping: 'Ücretsiz Kargo',
        feat_shipping_text: 'Türkiye geneli ücretsiz teslimat',
        feat_support: '7/24 Destek',
        feat_support_text: 'Teknik destek ve danışmanlık',

        // Products
        products_title: 'Tüm Ürünler',
        products_all: 'Tümü',
        products_radiators: 'Radyatörler',
        products_towel: 'Havlupanlar',
        products_mirror: 'Aynalı',
        products_count: 'ürün listeleniyor',
        products_showing: 'Gösterilen',
        product_quote: 'Teklif Al',
        product_in_stock: 'Stokta',
        product_code: 'Stok Kodu',
        product_desc: 'Ürün Açıklaması',
        product_specs: 'Teknik Özellikler',
        product_shipping: 'Kargo & Teslimat',

        // About
        about_title: 'Hakkımızda',
        about_subtitle: 'Premium Isıtma Teknolojileri',

        // Contact
        contact_title: 'İletişim',
        contact_form_title: 'Bize Ulaşın',
        contact_name: 'Adınız',
        contact_email: 'E-posta',
        contact_phone: 'Telefon',
        contact_subject: 'Konu',
        contact_message: 'Mesajınız',
        contact_send: 'Gönder',
        contact_address: 'Adres',
        contact_hours: 'Çalışma Saatleri',

        // Dealers
        dealers_title: 'Satış Noktaları',
        dealers_subtitle: 'Yetkili Bayilerimiz',
        dealers_desc: 'Türkiye genelinde yetkili satış ve servis noktalarımız',
        dealers_become: 'Bayi Olmak İster Misiniz?',
        dealers_become_text: 'Nixrad ailesine katılın, premium ısıtma çözümlerinin yetkili satıcısı olun.',
        dealers_apply: 'Başvuru Yap',

        // About Page
        about_hero_label: 'Nixrad Hakkında',
        about_hero_title: 'Türkiye\'nin Premium<br><span class="text-accent">Isıtma Markası</span>',
        about_hero_text: 'Karpan Mühendislik\'in tescilli markası olarak, yüksek kaliteli dekoratif radyatör ve havlupan üretiminde sektörün öncü firmalarından biriyiz.',
        about_values_label: 'Değerlerimiz',
        about_values_title: 'Değerlerimiz',
        about_values_text: 'Kalite, güvenilirlik ve müşteri memnuniyeti odaklı çalışıyoruz',
        about_warranty_title: 'Yıllık Garanti',
        about_warranty_text: 'Tüm ürünlerimiz 10 yıl garantilidir. Kalitemize olan güvenimizin en büyük göstergesi.',
        about_pressure_title: 'Bar Test Basıncı',
        about_pressure_text: 'Her ürünümüz 50 bar basınç testinden geçirilir. Güvenlik ve dayanıklılıkta taviz vermeyiz.',
        about_efficiency_title: 'Daha Fazla Verim',
        about_efficiency_text: 'Hibrit teknolojimiz sayesinde muadil ürünlere göre %33 daha fazla ısıl verim sağlıyoruz.',
        about_story_label: 'Hikayemiz',
        about_story_title: 'Hikayemiz',
        about_story_text1: 'Nixrad, Kocaeli Dilovası\'ndaki modern üretim tesislerimizde, en son teknoloji ve uzman kadromuzla premium ısıtma çözümleri üretmektedir.',
        about_story_text2: 'Hibrit teknolojisi ile üretilen radyatörlerimiz, çelik su kanalları ve alüminyum hava kanalları kombinasyonu sayesinde geleneksel radyatörlere göre çok daha yüksek verim sağlar.',
        about_story_text3: 'TSE onaylı üretim süreçlerimiz ve sıkı kalite kontrol standartlarımız ile her ürünümüzün mükemmel olmasını garanti ediyoruz.',
        about_local: 'Yerli Üretim',
        about_local_text: '%100 Türk malı',
        about_tse: 'TSE Onaylı',
        about_tse_text: 'Tüm kalite standartları',
        about_tech_label: 'Teknoloji',
        about_tech_title: 'Hibrit Teknolojisi',
        about_tech_subtitle: 'Çelik ve alüminyumun mükemmel uyumu',
        about_why_hybrid: 'Neden Hibrit?',
        about_steel_channels: 'Çelik Su Kanalları:',
        about_steel_text: 'Yüksek basınç dayanımı, sızdırmazlık ve uzun ömür sağlar. 50 bar basınç testinden geçer.',
        about_alu_channels: 'Alüminyum Hava Kanalları:',
        about_alu_text: 'Üstün ısı iletkenliği sayesinde odanızı hızla ısıtır. Enerji tasarrufu sağlar.',
        about_result: 'Sonuç:',
        about_result_text: 'Muadil radyatörlere göre %33 daha fazla ısıl verim, daha düşük enerji tüketimi ve daha uzun ömür.',
        about_benefit1: '%32 daha düşük su hacmi',
        about_benefit2: 'Hızlı ısınma süresi',
        about_benefit3: 'Tortu birikimi olmaz',
        about_benefit4: 'El yakmayan yüzey',
        about_cta_title: 'Projeleriniz İçin Yanınızdayız',
        about_cta_text: 'Uzman ekibimiz size en uygun ısıtma çözümünü sunmak için hazır.',
        about_download_catalog: 'Katalog İndir',

        // Contact Page
        contact_address_title: 'Adres',
        contact_phone_title: 'Telefon',
        contact_email_title: 'E-posta',
        contact_whatsapp_title: 'WhatsApp',
        contact_whatsapp_text: 'Hızlı destek için yazın',
        contact_working_hours: 'Pazartesi - Cuma: 09:00 - 18:00',
        contact_working_hours_sat: 'Cumartesi: 09:00 - 14:00',
        contact_subject_quote: 'Teklif Talebi',
        contact_subject_info: 'Bilgi Talebi',
        contact_subject_tech: 'Teknik Destek',
        contact_subject_dealer: 'Bayilik Başvurusu',
        contact_subject_other: 'Diğer',

        // Footer
        footer_desc: 'Premium dekoratif radyatör ve havlupan çözümleri. Yüksek teknoloji ve estetik tasarımın buluşma noktası.',
        footer_products: 'Ürünler',
        footer_company: 'Kurumsal',
        footer_support: 'Destek',
        footer_contact: 'İletişim',
        footer_privacy: 'Gizlilik Politikası',
        footer_terms: 'Kullanım Koşulları',
        footer_cookies: 'Çerez Politikası',
        footer_rights: 'Tüm hakları saklıdır.',
        footer_hybrid_radiators: 'Hibrit Radyatörler',
        footer_towel_rails: 'Havlupanlar',
        footer_mirror_radiators: 'Aynalı Radyatörler',
        footer_all_products: 'Tüm Ürünler',
        footer_about: 'Hakkımızda',
        footer_dealers: 'Satış Noktaları',
        footer_catalog: '2025 Katalog',
        footer_faq: 'Sıkça Sorulan Sorular',
        footer_warranty: 'Garanti Koşulları',
        similar_products: 'Benzer Ürünler',

        // CTA
        cta_title: 'Projeniz İçin Teklif Alın',
        cta_text: 'Uzman ekibimiz size en uygun ısıtma çözümünü sunmak için hazır.',
        cta_btn: 'İletişime Geç',

        // Home Page - Featured Section
        featured_title: 'Öne Çıkan Ürünler',
        featured_text: 'En çok tercih edilen premium ısıtma çözümlerimiz',
        explore_collection: 'Koleksiyonu Keşfet',
        view_details: 'Detayları Gör',

        // Home Page - About Preview
        about_preview_title: 'Türkiye\'nin Premium Isıtma Markası',
        about_preview_text1: 'Nixrad, Karpan Mühendislik\'in tescilli markası olarak, yüksek kaliteli dekoratif radyatör ve havlupan üretiminde sektörün öncü firmalarından biridir.',
        about_preview_text2: 'Hibrit teknolojisi ile üretilen radyatörlerimiz, çelik su kanalları ve alüminyum hava kanalları sayesinde %33 daha fazla ısıl verim sağlar.',
        about_high_efficiency: 'Yüksek Verim',
        about_high_efficiency_text: '%33 daha fazla ısıl verim',
        about_custom_colors: 'Özel Renkler',
        about_custom_colors_text: 'İstediğiniz renk seçeneği',
        about_local_production: 'Yerli Üretim',
        about_local_production_text: 'Kocaeli fabrikamızda',

        // Misc
        scroll_down: 'Aşağı Kaydır',
        view_all: 'Tümünü Gör',
        learn_more: 'Detaylar',
        back_home: 'Ana Sayfaya Dön',
        not_found: 'Ürün Bulunamadı',
        loading: 'Yükleniyor...'
    },
    en: {
        // Navigation
        nav_home: 'Home',
        nav_products: 'Products',
        nav_about: 'About',
        nav_dealers: 'Dealers',
        nav_contact: 'Contact',
        nav_catalog: '2025 Catalog',

        // Hero
        hero_label: 'Premium Heating Solutions',
        hero_title: 'Add <span>Luxury</span> and Warmth to Your Spaces',
        hero_text: 'Discover our collection of decorative radiators and heated towel rails where high technology meets aesthetic design. 10 years warranty, 50 bar tested.',
        hero_btn_products: 'Explore Collection',
        hero_btn_catalog: 'View Catalog',
        hero_stat_warranty: 'Year Warranty',
        hero_stat_pressure: 'Bar Tested',
        hero_stat_products: 'Products',

        // Categories
        cat_section_label: 'Categories',
        cat_section_title: 'Our Product Collection',
        cat_section_text: 'Premium heating solutions specially designed for every space',
        cat_radiators: 'Hybrid Radiators',
        cat_towel: 'Towel Rails',
        cat_mirror: 'Mirror Radiators',
        cat_products: 'products',

        // Features
        feat_warranty: '10 Year Warranty',
        feat_warranty_text: 'All our products come with 10 year warranty',
        feat_quality: 'Premium Quality',
        feat_quality_text: 'Superior durability with 50 bar testing',
        feat_shipping: 'Free Shipping',
        feat_shipping_text: 'Free delivery across Turkey',
        feat_support: '24/7 Support',
        feat_support_text: 'Technical support and consultancy',

        // Products
        products_title: 'All Products',
        products_all: 'All',
        products_radiators: 'Radiators',
        products_towel: 'Towel Rails',
        products_mirror: 'Mirror',
        products_count: 'products listed',
        products_showing: 'Showing',
        product_quote: 'Get Quote',
        product_in_stock: 'In Stock',
        product_code: 'Stock Code',
        product_desc: 'Product Description',
        product_specs: 'Technical Specs',
        product_shipping: 'Shipping & Delivery',

        // About
        about_title: 'About Us',
        about_subtitle: 'Premium Heating Technologies',

        // Contact
        contact_title: 'Contact',
        contact_form_title: 'Get in Touch',
        contact_name: 'Your Name',
        contact_email: 'E-mail',
        contact_phone: 'Phone',
        contact_subject: 'Subject',
        contact_message: 'Your Message',
        contact_send: 'Send',
        contact_address: 'Address',
        contact_hours: 'Working Hours',

        // Dealers
        dealers_title: 'Dealers',
        dealers_subtitle: 'Authorized Dealers',
        dealers_desc: 'Our authorized sales and service points across Turkey',
        dealers_become: 'Want to Become a Dealer?',
        dealers_become_text: 'Join the Nixrad family and become an authorized seller of premium heating solutions.',
        dealers_apply: 'Apply Now',

        // About Page
        about_hero_label: 'About Nixrad',
        about_hero_title: 'Turkey\'s Premium<br><span class="text-accent">Heating Brand</span>',
        about_hero_text: 'As the registered trademark of Karpan Engineering, we are one of the leading companies in the production of high-quality decorative radiators and towel rails.',
        about_values_label: 'Our Values',
        about_values_title: 'Our Values',
        about_values_text: 'We focus on quality, reliability and customer satisfaction',
        about_warranty_title: 'Year Warranty',
        about_warranty_text: 'All our products come with 10 year warranty. The biggest indicator of our confidence in quality.',
        about_pressure_title: 'Bar Pressure Test',
        about_pressure_text: 'Every product undergoes 50 bar pressure testing. No compromise on safety and durability.',
        about_efficiency_title: 'More Efficiency',
        about_efficiency_text: 'Thanks to our hybrid technology, we provide 33% more thermal efficiency compared to similar products.',
        about_story_label: 'Our Story',
        about_story_title: 'Our Story',
        about_story_text1: 'Nixrad produces premium heating solutions with the latest technology and expert staff at our modern production facilities in Dilovası, Kocaeli.',
        about_story_text2: 'Our radiators produced with hybrid technology provide much higher efficiency than traditional radiators thanks to the combination of steel water channels and aluminum air channels.',
        about_story_text3: 'We guarantee that every product is perfect with our TSE-approved production processes and strict quality control standards.',
        about_local: 'Local Production',
        about_local_text: '100% Made in Turkey',
        about_tse: 'TSE Approved',
        about_tse_text: 'All quality standards',
        about_tech_label: 'Technology',
        about_tech_title: 'Hybrid Technology',
        about_tech_subtitle: 'The perfect harmony of steel and aluminum',
        about_why_hybrid: 'Why Hybrid?',
        about_steel_channels: 'Steel Water Channels:',
        about_steel_text: 'Provides high pressure resistance, sealing and longevity. Passes 50 bar pressure test.',
        about_alu_channels: 'Aluminum Air Channels:',
        about_alu_text: 'Heats your room quickly thanks to superior thermal conductivity. Saves energy.',
        about_result: 'Result:',
        about_result_text: '33% more thermal efficiency, lower energy consumption and longer life compared to similar radiators.',
        about_benefit1: '32% lower water volume',
        about_benefit2: 'Fast heating time',
        about_benefit3: 'No sediment buildup',
        about_benefit4: 'Hand-safe surface',
        about_cta_title: 'We Are Here For Your Projects',
        about_cta_text: 'Our expert team is ready to offer you the best heating solution.',
        about_download_catalog: 'Download Catalog',

        // Contact Page
        contact_address_title: 'Address',
        contact_phone_title: 'Phone',
        contact_email_title: 'Email',
        contact_whatsapp_title: 'WhatsApp',
        contact_whatsapp_text: 'Write for quick support',
        contact_working_hours: 'Monday - Friday: 09:00 - 18:00',
        contact_working_hours_sat: 'Saturday: 09:00 - 14:00',
        contact_subject_quote: 'Quote Request',
        contact_subject_info: 'Information Request',
        contact_subject_tech: 'Technical Support',
        contact_subject_dealer: 'Dealer Application',
        contact_subject_other: 'Other',

        // Footer
        footer_desc: 'Premium decorative radiator and towel rail solutions. Where high technology meets aesthetic design.',
        footer_products: 'Products',
        footer_company: 'Company',
        footer_support: 'Support',
        footer_contact: 'Contact',
        footer_privacy: 'Privacy Policy',
        footer_terms: 'Terms of Use',
        footer_cookies: 'Cookie Policy',
        footer_rights: 'All rights reserved.',
        footer_hybrid_radiators: 'Hybrid Radiators',
        footer_towel_rails: 'Towel Rails',
        footer_mirror_radiators: 'Mirror Radiators',
        footer_all_products: 'All Products',
        footer_about: 'About Us',
        footer_dealers: 'Dealers',
        footer_catalog: '2025 Catalog',
        footer_faq: 'FAQ',
        footer_warranty: 'Warranty Terms',
        similar_products: 'Similar Products',

        // CTA
        cta_title: 'Get a Quote for Your Project',
        cta_text: 'Our expert team is ready to offer you the best heating solution.',
        cta_btn: 'Contact Us',

        // Home Page - Featured Section
        featured_title: 'Featured Products',
        featured_text: 'Our most preferred premium heating solutions',
        explore_collection: 'Explore Collection',
        view_details: 'View Details',

        // Home Page - About Preview
        about_preview_title: 'Turkey\'s Premium Heating Brand',
        about_preview_text1: 'Nixrad, as the registered trademark of Karpan Engineering, is one of the leading companies in the production of high-quality decorative radiators and towel rails.',
        about_preview_text2: 'Our radiators produced with hybrid technology provide 33% more thermal efficiency thanks to steel water channels and aluminum air channels.',
        about_high_efficiency: 'High Efficiency',
        about_high_efficiency_text: '33% more thermal efficiency',
        about_custom_colors: 'Custom Colors',
        about_custom_colors_text: 'Any color option you want',
        about_local_production: 'Local Production',
        about_local_production_text: 'At our Kocaeli factory',

        // Misc
        scroll_down: 'Scroll Down',
        view_all: 'View All',
        learn_more: 'Learn More',
        back_home: 'Back to Home',
        not_found: 'Product Not Found',
        loading: 'Loading...'
    }
};

// Current language - Default is English
let currentLang = localStorage.getItem('nixrad_lang') || 'en';

// Get translation
function t(key) {
    return translations[currentLang][key] || key;
}

// Switch language
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('nixrad_lang', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'tr' ? 'tr' : 'en';

    updatePageTranslations();
    updateLangSwitch();
    updateFilterLabels();

    // Reload products with new language
    loadProducts().then(() => {
        const page = document.body.dataset.page;
        if (page === 'products') {
            renderProducts(currentPage);
        } else if (page === 'product-detail') {
            initProductDetail();
        }
    });
}

// Update all translations on page
function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = t(key);
        } else if (el.tagName === 'OPTION') {
            el.textContent = t(key);
        } else {
            el.innerHTML = t(key);
        }
    });
}

// Update language switch UI
function updateLangSwitch() {
    document.querySelectorAll('.lang-switch span').forEach(span => {
        span.classList.toggle('active', span.dataset.lang === currentLang);
    });
}

// ============================================
// Products Data
// ============================================
let productData = { categories: {}, products: [], meta: {} };
let allProducts = [];

async function loadProducts() {
    try {
        // Select JSON file based on current language
        const jsonFile = currentLang === 'tr' ? 'products-categorized.json' : 'products-categorized-eng.json';
        const response = await fetch(jsonFile);
        productData = await response.json();
        allProducts = productData.products;
        console.log(`${allProducts.length} products loaded (${currentLang.toUpperCase()})`);
        return allProducts;
    } catch (error) {
        console.error('Failed to load products:', error);
        return [];
    }
}

// Update filter labels based on language
function updateFilterLabels() {
    const filterLabels = {
        tr: {
            all: 'Tümü',
            radyator: 'Radyatörler',
            havlupan: 'Havlupanlar',
            aynali: 'Aynalı Radyatörler',
            aksesuar: 'Aksesuarlar',
            'radyator-celik': 'Dekoratif Çelik',
            'radyator-hibrit': 'Dekoratif Hibrit',
            'radyator-elektrikli': 'Elektrikli',
            'radyator-ozel': 'Özel Tasarım',
            'havlupan-standart': 'Standart Çelik',
            'havlupan-dekoratif': 'Dekoratif',
            'havlupan-elektrikli': 'Elektrikli',
            'aynali-hibrit': 'Hibrit Aynalı',
            'aynali-celik': 'Çelik Aynalı',
            'aynali-elektrikli': 'Elektrikli Aynalı',
            'aksesuar-vana': 'Vanalar',
            'all-radyator': 'Tüm Radyatörler',
            'all-havlupan': 'Tüm Havlupanlar',
            'all-aynali': 'Tüm Aynalı',
            'all-aksesuar': 'Tüm Aksesuarlar'
        },
        en: {
            all: 'All',
            radyator: 'Radiators',
            havlupan: 'Towel Rails',
            aynali: 'Mirror Radiators',
            aksesuar: 'Accessories',
            'radyator-celik': 'Decorative Steel',
            'radyator-hibrit': 'Decorative Hybrid',
            'radyator-elektrikli': 'Electric',
            'radyator-ozel': 'Custom Design',
            'havlupan-standart': 'Standard Steel',
            'havlupan-dekoratif': 'Decorative',
            'havlupan-elektrikli': 'Electric',
            'aynali-hibrit': 'Hybrid Mirror',
            'aynali-celik': 'Steel Mirror',
            'aynali-elektrikli': 'Electric Mirror',
            'aksesuar-vana': 'Valves',
            'all-radyator': 'All Radiators',
            'all-havlupan': 'All Towel Rails',
            'all-aynali': 'All Mirror',
            'all-aksesuar': 'All Accessories'
        }
    };

    const labels = filterLabels[currentLang];

    // Update filter tabs
    document.querySelectorAll('.filter-tab[data-filter]').forEach(tab => {
        const filter = tab.dataset.filter;
        if (labels[filter]) {
            // Keep the SVG if exists
            const svg = tab.querySelector('svg');
            if (svg) {
                tab.innerHTML = labels[filter] + ' ' + svg.outerHTML;
            } else {
                tab.textContent = labels[filter];
            }
        }
    });

    // Update filter sub buttons
    document.querySelectorAll('.filter-sub[data-filter]').forEach(sub => {
        const filter = sub.dataset.filter;
        // Check if it's "all X" type
        if (filter === 'radyator' || filter === 'havlupan' || filter === 'aynali' || filter === 'aksesuar') {
            sub.textContent = labels['all-' + filter] || labels[filter];
        } else if (labels[filter]) {
            sub.textContent = labels[filter];
        }
    });
}

// Get category counts
function getCategoryCounts() {
    const counts = {
        radyator: 0,
        havlupan: 0,
        aynali: 0,
        aksesuar: 0,
        total: allProducts.length
    };

    // Eğer productData.categories varsa oradan al
    if (productData.categories) {
        for (const [familyKey, familyData] of Object.entries(productData.categories)) {
            const familyCount = familyData.subcategories?.reduce((sum, s) => sum + s.count, 0) || 0;
            counts[familyKey] = familyCount;
        }
    } else {
        // Fallback: ürünlerden say
        allProducts.forEach(p => {
            const family = (p.family || '').toLowerCase();
            if (counts[family] !== undefined) counts[family]++;
        });
    }

    return counts;
}

// Filter products
function filterProducts(filter = 'all') {
    if (filter === 'all') return allProducts;

    return allProducts.filter(p => {
        const family = p.family || '';
        const group = p.group || '';

        // Ana kategori filtreleme
        if (filter === 'radyator' || filter === 'havlupan' || filter === 'aynali' || filter === 'aksesuar') {
            return family === filter;
        }

        // Alt kategori (group) filtreleme
        return group === filter;
    });
}

// ============================================
// Product Card HTML - New Frameless Design
// ============================================
function productCardHTML(product) {
    const image = product.mainImage || (product.images && product.images[0]) || '';
    const categoryLabel = getCategoryLabel(product);
    const categoryFilter = getCategoryFilter(product);
    const hoverText = currentLang === 'tr' ? `Tüm ${categoryLabel} ürünlerini gör` : `View all ${categoryLabel} products`;

    return `
        <article class="product-card" data-animate>
            <a href="urun?slug=${product.slug}" class="product-link">
                <div class="product-image">
                    <img src="${image}" alt="${product.name}" loading="lazy">
                    <span class="product-category-tag">${categoryLabel}</span>
                    <div class="product-hover-overlay">
                        <h4>${product.name}</h4>
                        <p>${hoverText}</p>
                        <span class="btn-detail">
                            ${currentLang === 'tr' ? 'Detayları Gör' : 'View Details'}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                </div>
            </a>
        </article>
    `;
}

function getCategoryFilter(product) {
    const family = (product.family || '').toLowerCase();
    const slug = (product.slug || '').toLowerCase();

    if (family === 'aynali' || slug.includes('aynali')) return 'aynali';
    if (family === 'havlupan' || slug.includes('havlupan')) return 'havlupan';
    return 'radyator';
}

function getCategoryLabel(product) {
    // Eğer ürünün groupLabel'i varsa onu kullan
    if (product.groupLabel) {
        return product.groupLabel;
    }

    // Değilse familyLabel kullan
    if (product.familyLabel) {
        return product.familyLabel;
    }

    // Fallback
    const family = (product.family || '').toLowerCase();
    const labels = {
        radyator: currentLang === 'tr' ? 'Radyatör' : 'Radiator',
        havlupan: currentLang === 'tr' ? 'Havlupan' : 'Towel Rail',
        aynali: currentLang === 'tr' ? 'Aynalı Radyatör' : 'Mirror Radiator',
        aksesuar: currentLang === 'tr' ? 'Aksesuar' : 'Accessory'
    };
    return labels[family] || (currentLang === 'tr' ? 'Ürün' : 'Product');
}

// ============================================
// Page Initialization
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Set HTML lang attribute based on current language
    document.documentElement.lang = currentLang === 'tr' ? 'tr' : 'en';

    // Load products
    await loadProducts();

    // Initialize based on page
    const page = document.body.dataset.page;

    switch (page) {
        case 'home':
            initHomePage();
            break;
        case 'products':
            initProductsPage();
            break;
        case 'product-detail':
            initProductDetail();
            break;
    }

    // Common initializations
    initHeader();
    initAnimations();
    initLangSwitch();
    updatePageTranslations();
    updateFilterLabels();
});

// ============================================
// Header
// ============================================
function initHeader() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    // Scroll effect
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            nav.classList.toggle('open');
            document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
        });
    }

    // Close menu on link click
    nav?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('open');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ============================================
// Language Switch
// ============================================
function initLangSwitch() {
    document.querySelectorAll('.lang-switch').forEach(switcher => {
        switcher.addEventListener('click', (e) => {
            const span = e.target.closest('span[data-lang]');
            if (span) {
                switchLanguage(span.dataset.lang);
            }
        });
    });
    updateLangSwitch();
}

// ============================================
// Home Page
// ============================================
function initHomePage() {
    // Update category counts
    const counts = getCategoryCounts();

    document.querySelectorAll('[data-count]').forEach(el => {
        const key = el.dataset.count;
        if (counts[key] !== undefined) {
            el.textContent = counts[key];
        }
    });

    // Featured products artık statik olarak HTML'de tanımlı
    // JS ile yükleme devre dışı bırakıldı
    initAnimations();

    // Initialize horizontal scroll for collection on mobile
    initMobileHorizontalScroll();
}

// ============================================
// Mobile Horizontal Scroll - Collection Section
// Converts vertical scroll to horizontal scroll
// ============================================
function initMobileHorizontalScroll() {
    // Only on mobile
    if (window.innerWidth > 992) return;

    const collectionGrid = document.querySelector('.product-collection-grid');
    const collectionSection = document.querySelector('.product-collection');
    if (!collectionGrid || !collectionSection) return;

    const items = collectionGrid.querySelectorAll('.collection-item');
    if (items.length === 0) return;

    // Create scroll indicator dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'scroll-dots';
    dotsContainer.innerHTML = Array.from(items).map((_, i) =>
        `<span class="scroll-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');
    collectionSection.appendChild(dotsContainer);

    // Update dots on scroll
    collectionGrid.addEventListener('scroll', () => {
        const scrollLeft = collectionGrid.scrollLeft;
        const itemWidth = collectionGrid.offsetWidth;
        const activeIndex = Math.round(scrollLeft / itemWidth);

        dotsContainer.querySelectorAll('.scroll-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    });

    // Click on dots to scroll
    dotsContainer.querySelectorAll('.scroll-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            const itemWidth = collectionGrid.offsetWidth;
            collectionGrid.scrollTo({
                left: index * itemWidth,
                behavior: 'smooth'
            });
        });
    });

    // Vertical scroll to horizontal scroll conversion
    let isInSection = false;
    let startScrollTop = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isInSection = entry.isIntersecting && entry.intersectionRatio > 0.3;
            if (isInSection) {
                startScrollTop = window.scrollY;
            }
        });
    }, { threshold: [0.3, 0.5, 0.7] });

    observer.observe(collectionSection);

    // Handle wheel event for scroll hijacking
    let scrollTimeout;
    collectionSection.addEventListener('wheel', (e) => {
        if (window.innerWidth > 992) return;

        const scrollLeft = collectionGrid.scrollLeft;
        const maxScroll = collectionGrid.scrollWidth - collectionGrid.offsetWidth;

        // If at start and scrolling up, or at end and scrolling down, allow normal scroll
        if ((scrollLeft <= 0 && e.deltaY < 0) ||
            (scrollLeft >= maxScroll - 10 && e.deltaY > 0)) {
            return;
        }

        // Prevent vertical scroll, do horizontal instead
        e.preventDefault();

        collectionGrid.scrollBy({
            left: e.deltaY * 2,
            behavior: 'auto'
        });
    }, { passive: false });

    // Touch handling for better mobile experience
    let touchStartX = 0;
    let touchStartY = 0;

    collectionGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    collectionGrid.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = Math.abs(touchX - touchStartX);
        const deltaY = Math.abs(touchY - touchStartY);

        // If horizontal swipe is dominant, prevent vertical scroll
        if (deltaX > deltaY) {
            e.stopPropagation();
        }
    }, { passive: true });
}

// ============================================
// Products Page
// ============================================
let currentPage = 1;
let currentFilter = 'all';

function initProductsPage() {
    renderProducts();
    initFilters();
}

function renderProducts(page = 1) {
    const container = document.getElementById('products-grid');
    if (!container) return;

    const filtered = filterProducts(currentFilter);
    const totalPages = Math.ceil(filtered.length / CONFIG.PRODUCTS_PER_PAGE);
    const start = (page - 1) * CONFIG.PRODUCTS_PER_PAGE;
    const pageProducts = filtered.slice(start, start + CONFIG.PRODUCTS_PER_PAGE);

    container.innerHTML = pageProducts.map(p => productCardHTML(p)).join('');

    // Update count
    const countEl = document.getElementById('products-count');
    if (countEl) {
        countEl.innerHTML = `<span>${filtered.length}</span> ${t('products_count')}`;
    }

    // Render pagination
    renderPagination(page, totalPages);
    initAnimations();
}

function initFilters() {
    const filterTabs = document.getElementById('filter-tabs');
    if (!filterTabs) return;

    // Create overlay for mobile filter dropdowns
    let filterOverlay = document.querySelector('.filter-overlay');
    if (!filterOverlay) {
        filterOverlay = document.createElement('div');
        filterOverlay.className = 'filter-overlay';
        document.body.appendChild(filterOverlay);
    }

    // Toggle overlay with dropdown
    const toggleOverlay = (show) => {
        if (show) {
            filterOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            filterOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Close all dropdowns helper
    const closeAllDropdowns = () => {
        document.querySelectorAll('.filter-dropdown.open').forEach(d => d.classList.remove('open'));
        toggleOverlay(false);
    };

    // Ana kategori tabları
    filterTabs.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Eğer dropdown içindeyse, dropdown'ı aç/kapat
            const dropdown = tab.closest('.filter-dropdown');
            if (dropdown && tab.classList.contains('has-dropdown')) {
                e.stopPropagation();

                const isOpen = dropdown.classList.contains('open');

                // Diğer dropdown'ları kapat
                document.querySelectorAll('.filter-dropdown.open').forEach(d => {
                    if (d !== dropdown) d.classList.remove('open');
                });

                dropdown.classList.toggle('open');

                // Mobile: toggle overlay
                if (window.innerWidth <= 992) {
                    toggleOverlay(!isOpen);
                }
                return;
            }

            // Normal tab tıklaması
            setActiveFilter(tab.dataset.filter, tab);
            closeAllDropdowns();
        });
    });

    // Alt kategori butonları
    filterTabs.querySelectorAll('.filter-sub').forEach(sub => {
        sub.addEventListener('click', () => {
            setActiveFilter(sub.dataset.filter, sub);
            // Dropdown'ı kapat
            closeAllDropdowns();
        });
    });

    // Overlay tıklaması - dropdown'ları kapat
    filterOverlay.addEventListener('click', closeAllDropdowns);

    // Sayfa dışına tıklayınca dropdown'ları kapat
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-dropdown') && !e.target.closest('.filter-overlay')) {
            closeAllDropdowns();
        }
    });

    // ESC tuşu ile kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });

    // URL'den filtre al
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get('filter');
    if (urlFilter) {
        setActiveFilter(urlFilter);
    }
}

function setActiveFilter(filter, clickedElement = null) {
    // Tüm active sınıflarını kaldır
    document.querySelectorAll('.filter-tab, .filter-sub').forEach(el => el.classList.remove('active'));

    // Yeni active'i ayarla
    if (clickedElement) {
        clickedElement.classList.add('active');
        // Eğer alt kategori ise, üst kategori tab'ını da aktif yap
        const dropdown = clickedElement.closest('.filter-dropdown');
        if (dropdown) {
            dropdown.querySelector('.filter-tab').classList.add('active');
        }
    } else {
        // URL'den geldiyse, doğru elementi bul
        const element = document.querySelector(`[data-filter="${filter}"]`);
        if (element) {
            element.classList.add('active');
            const dropdown = element.closest('.filter-dropdown');
            if (dropdown) {
                dropdown.querySelector('.filter-tab').classList.add('active');
            }
        }
    }

    currentFilter = filter;
    currentPage = 1;
    renderProducts(1);

    // URL'i güncelle
    const url = new URL(window.location);
    if (filter && filter !== 'all') {
        url.searchParams.set('filter', filter);
    } else {
        url.searchParams.delete('filter');
    }
    window.history.replaceState({}, '', url);
}

function renderPagination(current, total) {
    const container = document.getElementById('pagination');
    if (!container || total <= 1) {
        if (container) container.innerHTML = '';
        return;
    }

    let html = '';

    // Previous
    if (current > 1) {
        html += `<button class="page-btn" data-page="${current - 1}">&laquo;</button>`;
    }

    // Page numbers
    for (let i = 1; i <= total; i++) {
        if (i === current) {
            html += `<button class="page-btn active">${i}</button>`;
        } else if (i === 1 || i === total || (i >= current - 2 && i <= current + 2)) {
            html += `<button class="page-btn" data-page="${i}">${i}</button>`;
        } else if (i === current - 3 || i === current + 3) {
            html += `<span class="page-dots">...</span>`;
        }
    }

    // Next
    if (current < total) {
        html += `<button class="page-btn" data-page="${current + 1}">&raquo;</button>`;
    }

    container.innerHTML = html;

    // Add click handlers
    container.querySelectorAll('.page-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            renderProducts(currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ============================================
// Product Detail
// ============================================
function initProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    const product = allProducts.find(p => p.slug === slug);
    const container = document.getElementById('product-detail');

    if (!product) {
        if (container) {
            container.innerHTML = `
                <div class="not-found" style="text-align:center;padding:100px 0;">
                    <h2>${t('not_found')}</h2>
                    <p style="margin:20px 0;color:var(--text-secondary);">
                        <a href="urunler" style="color:var(--accent-primary);">${t('back_home')}</a>
                    </p>
                </div>
            `;
        }
        return;
    }

    // Update page title
    document.title = `${product.name} - Nixrad`;

    // Update breadcrumb
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    const breadcrumbCatSep = document.getElementById('breadcrumb-cat-sep');

    if (breadcrumbProduct) breadcrumbProduct.textContent = product.name;

    // Kategori breadcrumb'ını ekle
    if (breadcrumbCategory && product.familyLabel) {
        breadcrumbCategory.innerHTML = `<a href="urunler?filter=${product.family}">${product.familyLabel}</a>`;
        if (breadcrumbCatSep) breadcrumbCatSep.style.display = 'inline';
    }

    // Render product detail
    if (container) {
        container.innerHTML = productDetailHTML(product);
        initGallery();
        initVariants();
        initTabs();

        // Add mobile sticky CTA
        initMobileStickyCTA(product);
    }
}

// Mobile Sticky CTA for product detail
function initMobileStickyCTA(product) {
    // Only show on mobile
    if (window.innerWidth > 992) return;

    // Check if already exists
    if (document.querySelector('.product-detail-sticky-cta')) return;

    const stickyCTA = document.createElement('div');
    stickyCTA.className = 'product-detail-sticky-cta';
    stickyCTA.innerHTML = `
        <a href="mailto:info@nixrad.com?subject=Teklif: ${encodeURIComponent(product.name)}" class="btn-add-quote">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            ${t('product_quote')}
        </a>
        <button class="btn-wishlist" aria-label="Favorilere ekle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    `;

    document.body.appendChild(stickyCTA);

    // Handle resize - remove on desktop
    window.addEventListener('resize', () => {
        const existingCTA = document.querySelector('.product-detail-sticky-cta');
        if (window.innerWidth > 992 && existingCTA) {
            existingCTA.remove();
        }
    });
}

function productDetailHTML(product) {
    const mainImage = product.mainImage || (product.images && product.images[0]) || '';
    const images = product.images || [mainImage];
    const categoryLabel = getCategoryLabel(product);

    // Group variants
    let variantsHTML = '';
    if (product.variants && product.variants.length > 0) {
        const groups = {};
        product.variants.forEach(v => {
            const type = v.type || 'Option';
            if (!groups[type]) groups[type] = [];
            if (!groups[type].find(x => x.name === v.name)) {
                groups[type].push(v);
            }
        });

        variantsHTML = '<div class="product-variants">';
        for (const [type, variants] of Object.entries(groups)) {
            variantsHTML += `
                <div class="variant-group">
                    <label class="variant-label">${type}</label>
                    <div class="variant-options">
                        ${variants.map((v, i) => `<button class="variant-btn ${i === 0 ? 'active' : ''}">${v.name}</button>`).join('')}
                    </div>
                </div>
            `;
        }
        variantsHTML += '</div>';
    }

    // Clean description - yeni JSON'dan cleanDescription kullan
    let description = product.cleanDescription || product.shortDescription || product.description || '';

    return `
        <div class="product-detail-grid">
            <div class="product-gallery">
                <div class="gallery-main">
                    <img id="main-image" src="${mainImage}" alt="${product.name}">
                </div>
                <div class="gallery-thumbs">
                    ${images.slice(0, 4).map((img, i) => `
                        <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-image="${img}">
                            <img src="${img}" alt="${product.name}">
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="product-detail-info">
                <span class="product-detail-category">${categoryLabel}</span>
                <h1 class="product-detail-title">${product.name}</h1>
                ${product.stockCode ? `<p class="product-detail-code">${t('product_code')}: <strong>${product.stockCode}</strong></p>` : ''}

                ${variantsHTML}

                <div class="product-detail-actions">
                    <a href="mailto:info@nixrad.com?subject=Teklif: ${encodeURIComponent(product.name)}" class="btn-add-quote">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        ${t('product_quote')}
                    </a>
                    <button class="btn-wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>

                <div class="product-detail-features">
                    <div class="detail-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>10 Yıl Garanti</span>
                    </div>
                    <div class="detail-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>50 Bar Test</span>
                    </div>
                    <div class="detail-feature">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>Ücretsiz Kargo</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="product-tabs">
            <div class="tabs-nav">
                <button class="tab-btn active" data-tab="description">${t('product_desc')}</button>
                <button class="tab-btn" data-tab="specs">${t('product_specs')}</button>
                <button class="tab-btn" data-tab="shipping">${t('product_shipping')}</button>
            </div>
            <div class="tab-content active" id="tab-description">
                ${description || '<p>Bu ürün hakkında detaylı bilgi için bizimle iletişime geçebilirsiniz.</p>'}
            </div>
            <div class="tab-content" id="tab-specs">
                <ul>
                    <li>10 yıl garanti</li>
                    <li>50 bar basınç testi</li>
                    <li>Elektrostatik toz boya</li>
                    <li>Çelik ve/veya alüminyum yapı</li>
                    <li>Merkezi sistem ve elektrikli kullanım seçenekleri</li>
                </ul>
            </div>
            <div class="tab-content" id="tab-shipping">
                <p>Türkiye genelinde ücretsiz kargo ile gönderim yapılmaktadır.</p>
                <p>Siparişleriniz 1-3 iş günü içinde kargoya verilir.</p>
                <p>Hasarlı ürün teslimatlarında ücretsiz değişim garantisi.</p>
            </div>
        </div>
    `;
}

function initGallery() {
    const mainImage = document.getElementById('main-image');
    const thumbs = document.querySelectorAll('.gallery-thumb');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainImage.src = thumb.dataset.image;
        });
    });
}

function initVariants() {
    document.querySelectorAll('.variant-options').forEach(group => {
        group.querySelectorAll('.variant-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                group.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });
}

function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });
}

// ============================================
// Animations
// ============================================
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: CONFIG.ANIMATION_THRESHOLD,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('[data-animate]:not(.animated)').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// Smooth Scroll
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Export for global access
window.Nixrad = {
    switchLanguage,
    t,
    filterProducts,
    loadProducts
};
