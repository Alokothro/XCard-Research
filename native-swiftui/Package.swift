// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "XCardNative",
    platforms: [.macOS(.v14)],
    targets: [
        .executableTarget(
            name: "XCardNative",
            path: "Sources/XCardNative"
        )
    ]
)
