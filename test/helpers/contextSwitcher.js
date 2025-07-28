function toNative(driver) {
	return driver.switchContext("NATIVE_APP");
}

function toWebview(driver) {
	const packageName = getPackageName(driver);
	return driver.switchContext(`WEBVIEW_${packageName}`);
}

function getPackageName(driver) {
	const caps = driver.capabilities;

	let packageName;
	if (caps.platformName === "Android") {
		packageName = caps.appPackage;
	} else {
		throw new Error(`Unsupported platform: ${caps.platformName}`);
	}
	return packageName;
}

export default { toNative, toWebview };
