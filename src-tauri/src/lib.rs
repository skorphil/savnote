// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_android_fs::AndroidFsExt;

#[tauri::command]
async fn show_persistent_save_dialog(
    app: tauri::AppHandle,
    default_name: &str,
    mime_type: Option<&str>,
) -> std::result::Result<Option<tauri_plugin_fs::FilePath>, String> {
    let api = app.android_fs();
    let picker = api.file_picker();

    let uri = picker
        .save_file(None, default_name, mime_type, false)
        .map_err(|e| format!("{e}"))?;

    let Some(uri) = uri else { return Ok(None) };

    picker.persist_uri_permission(&uri)
        .map_err(|e| format!("{e}"))?;

    Ok(Some(uri.into()))
}

#[tauri::command]
async fn show_persistent_open_dialog(
    app: tauri::AppHandle,
    mime_types: Vec<String>,
) -> std::result::Result<Option<tauri_plugin_fs::FilePath>, String> {
    let api = app.android_fs();
    let picker = api.file_picker();

    let uri = picker
        .pick_file(None, &mime_types.iter().map(|s| s.as_str()).collect::<Vec<_>>(), false)
        .map_err(|e| format!("{e}"))?;

    let Some(uri) = uri else { return Ok(None) };

    picker.persist_uri_permission(&uri)
        .map_err(|e| format!("{e}"))?;

    Ok(Some(uri.into()))
}

#[tauri::command]
async fn write_string(
    uri: tauri_plugin_fs::FilePath,
    contents: String,
    app: tauri::AppHandle
) -> std::result::Result<(), String> {
    app.android_fs()
        .write(&uri.into(), contents.as_bytes())
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
