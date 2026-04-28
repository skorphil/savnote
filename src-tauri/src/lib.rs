// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_android_fs::{AndroidFs, AndroidFsExt};

#[tauri::command]
async fn show_persistent_save_dialog(
    app: tauri::AppHandle, // This arg is auto set by tauri
    default_name: &str,
    // initial_location: Option<&FileUri>,
    mime_type: Option<&str>,
) -> std::result::Result<Option<tauri_plugin_fs::FilePath>, String> {
    // take api
    let api = app.android_fs();

    // pick file to save
    let uri = api
        .show_save_file_dialog(None, default_name, mime_type)
        .map_err(|e| format!("{e}"))?;

    // if unselected, return null
    let Some(uri) = uri else { return Ok(None) }; // uri: FileUri

    // take persistable read-write permission
    api.take_persistable_uri_permission(&uri) // mismatched types expected `&FileUri`, found `FileUri`
        .map_err(|e| format!("{e}"))?;

    // This path can be used with the official fs plugin
    let path = uri.into();

    Ok(Some(path))
}

#[tauri::command]
async fn show_persistent_open_dialog(
    app: tauri::AppHandle, // This arg is auto set by tauri
    // initial_location: Option<&FileUri>,
    mime_types: Vec<String>,
) -> std::result::Result<Option<tauri_plugin_fs::FilePath>, String> {
    // take api
    let api = app.android_fs();

    // pick file to open
    let mut uris = api
        .show_open_file_dialog(None, &mime_types.iter().map(|s| s.as_str()).collect::<Vec<_>>(), false)
        .map_err(|e| format!("{e}"))?;

    // if unselected, return null

    let Some(uri) = uris.pop() else {
        return Ok(None); // If Vec is empty
    };

    
    // take persistable read-write permission
    api.take_persistable_uri_permission(&uri)
        .map_err(|e| format!("{e}"))?;

    // This path can be used with the official fs plugin
    let path = uri.into();

    Ok(Some(path))
}


#[tauri::command]
async fn write_string(
    uri: tauri_plugin_fs::FilePath,
    contents: String,
    app: tauri::AppHandle
) -> std::result::Result<(), String> {

    app.android_fs()
        .write_via_kotlin(&uri.into(), contents.as_bytes())
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_android_fs::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![show_persistent_save_dialog, 
            show_persistent_open_dialog, 
            write_string])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
