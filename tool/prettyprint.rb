require 'json'
require 'pp'
pp JSON.load(File.read(ARGV.first))
