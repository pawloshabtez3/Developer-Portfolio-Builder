const PDFDocument = require("pdfkit");

/**
 * Generates a professional resume PDF
 * @param {Object} userData - Original user data
 * @param {Object} enhancedContent - AI-enhanced content from Gemini
 * @returns {Promise<Buffer>} PDF as a buffer
 */
const generateResumePDF = (userData, enhancedContent) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        bufferPages: true,
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Colors
      const primaryColor = "#1a1a2e";
      const accentColor = "#4a90d9";
      const textColor = "#333333";
      const lightGray = "#666666";

      // Helper function to format date
      const formatDate = (dateStr) => {
        if (!dateStr) return "Present";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      };

      // ============ HEADER SECTION ============
      doc
        .fillColor(primaryColor)
        .fontSize(28)
        .font("Helvetica-Bold")
        .text(userData.name?.toUpperCase() || "YOUR NAME", { align: "center" });

      doc.moveDown(0.3);

      if (userData.role) {
        doc
          .fillColor(accentColor)
          .fontSize(14)
          .font("Helvetica")
          .text(userData.role, { align: "center" });
      }

      if (userData.location) {
        doc
          .fillColor(lightGray)
          .fontSize(10)
          .text(userData.location, { align: "center" });
      }

      doc.moveDown(0.5);

      // ============ CONTACT BAR ============
      const contactItems = [];
      if (userData.email) contactItems.push(userData.email);
      if (userData.linkedIn) contactItems.push(userData.linkedIn);
      if (userData.github) contactItems.push(userData.github);
      if (userData.portfolio) contactItems.push(userData.portfolio);

      if (contactItems.length > 0) {
        doc
          .fillColor(textColor)
          .fontSize(9)
          .text(contactItems.join("  |  "), { align: "center" });
      }

      doc.moveDown(0.5);

      // Divider line
      doc
        .strokeColor(accentColor)
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();

      doc.moveDown(1);

      // ============ PROFESSIONAL SUMMARY ============
      if (enhancedContent.summary) {
        doc
          .fillColor(primaryColor)
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("PROFESSIONAL SUMMARY");

        doc.moveDown(0.3);

        doc
          .fillColor(textColor)
          .fontSize(10)
          .font("Helvetica")
          .text(enhancedContent.summary, {
            align: "justify",
            lineGap: 2,
          });

        doc.moveDown(1);
      }

      // ============ SKILLS SECTION ============
      if (enhancedContent.skills && enhancedContent.skills.length > 0) {
        doc
          .fillColor(primaryColor)
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("SKILLS");

        doc.moveDown(0.3);

        doc
          .fillColor(textColor)
          .fontSize(10)
          .font("Helvetica")
          .text(enhancedContent.skills.join("  •  "), {
            lineGap: 2,
          });

        doc.moveDown(1);
      }

      // ============ EXPERIENCE SECTION ============
      if (
        enhancedContent.experience &&
        enhancedContent.experience.length > 0 &&
        userData.experience &&
        userData.experience.length > 0
      ) {
        doc
          .fillColor(primaryColor)
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("PROFESSIONAL EXPERIENCE");

        doc.moveDown(0.5);

        // Match enhanced content with original experience for dates
        userData.experience.forEach((exp, index) => {
          const enhanced = enhancedContent.experience[index] || {};

          // Role and Company
          doc.fillColor(textColor).fontSize(11).font("Helvetica-Bold");

          const roleText = enhanced.role || exp.role;
          const companyText = enhanced.company || exp.company;

          doc.text(roleText, 50, doc.y, { continued: true });
          doc
            .font("Helvetica")
            .text(` at ${companyText}`, { continued: false });

          // Date range
          const dateText = `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`;
          doc.fillColor(lightGray).fontSize(9).text(dateText);

          doc.moveDown(0.3);

          // Description
          if (enhanced.description) {
            doc.fillColor(textColor).fontSize(10).font("Helvetica");

            // Split description into bullet points if it contains line breaks or bullet indicators
            const descriptions = enhanced.description
              .split(/[\n•-]/)
              .filter((d) => d.trim());

            descriptions.forEach((desc) => {
              doc.text(`• ${desc.trim()}`, 60, doc.y, {
                width: 485,
                lineGap: 2,
              });
            });
          }

          doc.moveDown(0.8);
        });
      }

      // ============ PROJECTS SECTION ============
      if (
        enhancedContent.projects &&
        enhancedContent.projects.length > 0 &&
        userData.projects &&
        userData.projects.length > 0
      ) {
        doc
          .fillColor(primaryColor)
          .fontSize(12)
          .font("Helvetica-Bold")
          .text("PROJECTS");

        doc.moveDown(0.5);

        userData.projects.forEach((proj, index) => {
          const enhanced = enhancedContent.projects[index] || {};

          // Project title
          doc
            .fillColor(textColor)
            .fontSize(11)
            .font("Helvetica-Bold")
            .text(enhanced.title || proj.title);

          doc.moveDown(0.2);

          // Description
          if (enhanced.description || proj.description) {
            doc
              .fillColor(textColor)
              .fontSize(10)
              .font("Helvetica")
              .text(enhanced.description || proj.description, {
                width: 495,
                lineGap: 2,
              });
          }

          // Live URL
          if (proj.liveUrl) {
            doc
              .fillColor(accentColor)
              .fontSize(9)
              .text(proj.liveUrl, { link: proj.liveUrl });
          }

          doc.moveDown(0.8);
        });
      }

      // ============ FOOTER ============
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc
          .fillColor(lightGray)
          .fontSize(8)
          .text(
            `Generated with Portfolio Builder`,
            50,
            doc.page.height - 30,
            { align: "center", width: doc.page.width - 100 }
          );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateResumePDF };
