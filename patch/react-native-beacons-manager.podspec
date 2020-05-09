require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name        = "react-native-beacons-manager"
  s.summary     = "React-Native library for detecting beacons (iOS and Android)"
  s.version     = package['version']
  s.authors      = { "" => "" }
  s.homepage        = "https://github.com/MacKentoch/react-native-beacons-manager#readme"
  s.license         = "Apache-2.0"
  s.platform        = :ios, "8.0"
  s.source          = { :git => "https://github.com/MacKentoch/react-native-beacons-manager.git" }
  s.source_files    = "ios/**/*.{h,m}"
  s.dependency 'React'
end