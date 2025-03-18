// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri_plugin_android_fs::{AndroidFs, AndroidFsExt, PersistableAccessMode};

#[tauri::command] // ERROR previous definition of the macro `__cmd__show_persistent_save_dialog` her
pub async fn show_persistent_save_dialog( // ERROR the name `__cmd__show_persistent_save_dialog` is defined multiple times
    // `__cmd__show_persistent_save_dialog` must be defined only once in the macro namespace of this module
    // `__cmd__show_persistent_save_dialog` reimported here
    app: tauri::AppHandle, // This arg is auto set by tauri
    default_file_name: &str,
    mime_type: Option<&str>,
) -> std::result::Result<Option<tauri_plugin_fs::FilePath>, String> { 
   
    // take api
    let api = app.android_fs();

    // pick file to save
    let uri = api
        .show_save_file_dialog(default_file_name, mime_type)
        .map_err(|e| format!("{e}"))?;

    // if unselected, return null
    let Some(uri) = uri else {
        return Ok(None)
    };

    // take persistable uri permission
    api.take_persistable_uri_permission(uri.clone(), PersistableAccessMode::ReadAndWrite)
        .map_err(|e| format!("{e}"))?;

    // This path can be used with the official fs plugin
    let path = uri.into();

    Ok(Some(path))
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_android_fs::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            show_persistent_save_dialog,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}