require "digest"
require "fileutils"

module FingerprintCss
  STYLESHEET_PATTERN = %r{/css/site\.css(?:\?v=[^\"']+)?}

  def self.process(site)
    css_path = File.join(site.dest, "css", "site.css")
    return unless File.file?(css_path)

    digest = Digest::SHA256.file(css_path).hexdigest[0, 12]
    fingerprinted_name = "site-#{digest}.css"
    fingerprinted_path = File.join(site.dest, "css", fingerprinted_name)

    FileUtils.cp(css_path, fingerprinted_path)

    stylesheet_url = "/css/#{fingerprinted_name}"
    updated_pages = 0

    Dir.glob(File.join(site.dest, "**", "*.html")).each do |html_path|
      html = File.binread(html_path)
      updated_html = html.gsub(STYLESHEET_PATTERN, stylesheet_url)
      next if updated_html == html

      File.binwrite(html_path, updated_html)
      updated_pages += 1
    end

    Jekyll.logger.info "CSS fingerprint:", "#{fingerprinted_name} in #{updated_pages} pages"
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  FingerprintCss.process(site)
end
