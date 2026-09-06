-- Esquema de Base de Datos SQL Server para BioAR

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'BioARDB')
BEGIN
    CREATE DATABASE BioARDB;
END
GO

USE BioARDB;
GO

-- Tabla de Usuarios (SaaS Multi-tenancy)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        plan NVARCHAR(20) NOT NULL DEFAULT 'free', -- 'free', 'pro', 'plus'
        custom_slug NVARCHAR(100) NOT NULL UNIQUE,
        display_name NVARCHAR(150) NULL,
        avatar_url NVARCHAR(500) NULL,
        bio_text NVARCHAR(1000) NULL,
        seo_title NVARCHAR(255) NULL,
        seo_description NVARCHAR(500) NULL,
        created_at DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Tabla de Bloques de Contenido Flexible
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Blocks')
BEGIN
    CREATE TABLE Blocks (
        id INT IDENTITY(1,1) PRIMARY KEY,
        user_id INT NOT NULL FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE,
        type NVARCHAR(50) NOT NULL, -- 'header', 'song_info', 'image', 'text', 'social_links'
        position INT NOT NULL DEFAULT 0,
        content_json NVARCHAR(MAX) NOT NULL, -- Configuración flexible del bloque en JSON
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Tabla de Configuración de Estilo / Tema por Usuario
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'UserSettings')
BEGIN
    CREATE TABLE UserSettings (
        user_id INT PRIMARY KEY FOREIGN KEY REFERENCES Users(id) ON DELETE CASCADE,
        background_color NVARCHAR(50) NOT NULL DEFAULT '#0f172a',
        background_type NVARCHAR(50) NOT NULL DEFAULT 'solid', -- 'solid', 'gradient', 'mesh'
        text_color NVARCHAR(50) NOT NULL DEFAULT '#ffffff',
        button_style NVARCHAR(50) NOT NULL DEFAULT 'rounded', -- 'rounded', 'pill', 'shadow', 'glass'
        button_color NVARCHAR(50) NOT NULL DEFAULT '#3b82f6',
        button_text_color NVARCHAR(50) NOT NULL DEFAULT '#ffffff',
        font_family NVARCHAR(50) NOT NULL DEFAULT 'Inter',
        show_branding BIT NOT NULL DEFAULT 1
    );
END
GO
