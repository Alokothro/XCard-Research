import SwiftUI

struct RootTabView: View {
    init() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(Theme.surface)
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
        UITabBar.appearance().tintColor = UIColor(Theme.bronze)
    }

    var body: some View {
        TabView {
            HomeView()
                .tabItem { Label("Home", systemImage: "house.fill") }
            WalletView()
                .tabItem { Label("Wallet", systemImage: "wallet.pass.fill") }
            RecommendView()
                .tabItem { Label("Recommend", systemImage: "sparkles") }
        }
        .preferredColorScheme(.dark)
    }
}
