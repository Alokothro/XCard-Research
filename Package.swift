// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "XCardNative",
    // iOS is the real target for the app itself. macOS is declared only so
    // `swift test` (which always runs on the host Mac) has a modern enough
    // minimum to compile SwiftUI APIs like the two-parameter onChange used
    // in the views — it does not mean the app ships for macOS.
    platforms: [.iOS(.v17), .macOS(.v14)],
    targets: [
        .target(
            name: "XCardCore",
            path: "Sources/XCardCore"
        ),
        .executableTarget(
            name: "XCardNative",
            dependencies: ["XCardCore"],
            path: "Sources/XCardNative"
        ),
        .testTarget(
            name: "XCardNativeTests",
            dependencies: ["XCardCore"],
            path: "Tests/XCardNativeTests"
        )
    ]
)
