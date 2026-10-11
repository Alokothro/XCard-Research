import SwiftUI

struct RootTabView: View {
    @EnvironmentObject var themeManager: ThemeManager
    var palette: ThemePalette { themeManager.palette }

    var body: some View {
        TabView {
            WalletView()
                .tabItem { Label("Wallet", systemImage: "wallet.pass.fill") }
            InsightsView()
                .tabItem { Label("Insights", systemImage: "chart.pie.fill") }
            HomeView()
                .tabItem { Label("Home", systemImage: "house.fill") }
            ProfileView()
                .tabItem { Label("Profile", systemImage: "person.fill") }
            SettingsView()
                .tabItem { Label("Settings", systemImage: "slider.horizontal.3") }
        }
        .tint(palette.bronze)
        .preferredColorScheme(themeManager.mode)
        .onAppear { applyTabBarAppearance() }
        .onChange(of: themeManager.mode) { _, _ in applyTabBarAppearance() }
    }

    private func applyTabBarAppearance() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(palette.surface)
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
        UITabBar.appearance().tintColor = UIColor(palette.bronze)
    }
}
