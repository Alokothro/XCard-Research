import SwiftUI

struct ScoreRing: View {
    let percent: Int
    var size: CGFloat = 128
    var stroke: CGFloat = 12
    let palette: ThemePalette

    var body: some View {
        ZStack {
            Circle()
                .stroke(palette.surfaceAlt, lineWidth: stroke)
            Circle()
                .trim(from: 0, to: CGFloat(percent) / 100)
                .stroke(palette.bronze, style: StrokeStyle(lineWidth: stroke, lineCap: .round))
                .rotationEffect(.degrees(-90))
            Text("\(percent)%")
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(palette.textPrimary)
        }
        .frame(width: size, height: size)
    }
}
