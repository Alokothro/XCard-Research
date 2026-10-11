import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var themeManager: ThemeManager
    var palette: ThemePalette { themeManager.palette }

    let rows = ["Personal info", "Linked cards (4)", "Notifications", "Security & privacy"]

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 10) {
                Circle()
                    .fill(palette.surfaceAlt)
                    .overlay(Circle().stroke(palette.borderStrong))
                    .overlay(Text("D").font(.system(size: 24, design: .monospaced)).foregroundColor(palette.bronze))
                    .frame(width: 68, height: 68)
                Text("Denise Alvarez")
                    .font(.system(size: 19, design: .monospaced))
                    .foregroundColor(palette.textPrimary)
                Text("Member since Sept 2026")
                    .font(.caption)
                    .foregroundColor(palette.textMuted)
            }
            .padding(.top, 32)
            .padding(.bottom, 16)

            VStack(spacing: 0) {
                ForEach(Array(rows.enumerated()), id: \.offset) { index, label in
                    HStack {
                        Text(label).foregroundColor(palette.textPrimary)
                        Spacer()
                        Image(systemName: "chevron.right").foregroundColor(palette.textMuted).font(.footnote)
                    }
                    .padding(.vertical, 15)
                    if index < rows.count - 1 {
                        Divider().background(palette.border)
                    }
                }
            }
            .padding(.horizontal, 20)

            Spacer()
        }
        .background(palette.background.ignoresSafeArea())
    }
}
