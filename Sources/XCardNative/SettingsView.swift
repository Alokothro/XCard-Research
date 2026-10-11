import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var themeManager: ThemeManager
    var palette: ThemePalette { themeManager.palette }

    let rows = ["Notifications", "Security & privacy", "Connected accounts", "Help & support"]

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Settings")
                .font(.system(size: 26, weight: .semibold, design: .monospaced))
                .foregroundColor(palette.textPrimary)
                .padding(20)

            VStack(spacing: 0) {
                HStack {
                    Text("Appearance").foregroundColor(palette.textPrimary)
                    Spacer()
                    HStack(spacing: 2) {
                        appearanceOption("DARK", .dark)
                        appearanceOption("LIGHT", .light)
                    }
                    .padding(2)
                    .background(palette.surface)
                    .clipShape(Capsule())
                    .overlay(Capsule().stroke(palette.border))
                }
                .padding(.vertical, 15)
                Divider().background(palette.border)

                ForEach(Array(rows.enumerated()), id: \.offset) { index, label in
                    HStack {
                        Text(label).foregroundColor(palette.textPrimary)
                        Spacer()
                        Image(systemName: "chevron.right").foregroundColor(palette.textMuted).font(.footnote)
                    }
                    .padding(.vertical, 15)
                    Divider().background(palette.border)
                }

                HStack {
                    Text("Log out").foregroundColor(palette.critical)
                    Spacer()
                }
                .padding(.vertical, 15)
            }
            .padding(.horizontal, 20)

            Spacer()
        }
        .background(palette.background.ignoresSafeArea())
    }

    @ViewBuilder
    func appearanceOption(_ label: String, _ scheme: ColorScheme) -> some View {
        let active = themeManager.mode == scheme
        Button {
            themeManager.mode = scheme
        } label: {
            Text(label)
                .font(.system(size: 11, weight: .bold))
                .padding(.vertical, 6)
                .padding(.horizontal, 14)
                .background(active ? palette.bronze : Color.clear)
                .foregroundColor(active ? Color(hex: "#14100A") : palette.textMuted)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}
