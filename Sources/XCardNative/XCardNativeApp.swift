import SwiftUI

@main
struct XCardNativeApp: App {
    @StateObject private var themeManager = ThemeManager()

    var body: some Scene {
        WindowGroup {
            RootTabView()
                .environmentObject(themeManager)
        }
    }
}
