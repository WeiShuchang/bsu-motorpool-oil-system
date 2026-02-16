<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&family=Lora:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">

        <!-- Favicon -->
        <link rel="apple-touch-icon" sizes="180x180" href="/storage/icons/bsu_motorpool-removebg-preview.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/storage/icons/bsu_motorpool-removebg-preview.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/storage/icons/bsu_motorpool-removebg-preview.png">
        <link rel="shortcut icon" href="/storage/icons/bsu_motorpool-removebg-preview.png">
        
        <!-- Optional: Add theme color for mobile browsers -->
        <meta name="theme-color" content="#16a34a"> <!-- green-600 color -->

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>